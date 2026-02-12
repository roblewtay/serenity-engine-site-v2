<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	let canvas: HTMLCanvasElement;
	let gl: WebGLRenderingContext | null = null;
	let animationId: number;
	let startTime = 0;

	// Mouse
	let mouseX = 0.5;
	let mouseY = 0.5;
	let prevMouseX = 0.5;
	let prevMouseY = 0.5;
	let mouseForce = 0;

	// Fluid sim state
	let hasSim = false;
	let simProg: WebGLProgram | null = null;
	let renProg: WebGLProgram | null = null;
	let fboA: { fbo: WebGLFramebuffer; tex: WebGLTexture } | null = null;
	let fboB: { fbo: WebGLFramebuffer; tex: WebGLTexture } | null = null;
	let simW = 0;
	let simH = 0;

	// Sim uniforms
	let sState: WebGLUniformLocation | null = null;
	let sTexel: WebGLUniformLocation | null = null;
	let sMouse: WebGLUniformLocation | null = null;
	let sForce: WebGLUniformLocation | null = null;
	let sDamp: WebGLUniformLocation | null = null;

	// Render uniforms
	let rState: WebGLUniformLocation | null = null;
	let rTime: WebGLUniformLocation | null = null;
	let rRes: WebGLUniformLocation | null = null;
	let rSimTexel: WebGLUniformLocation | null = null;

	// Fallback uniforms (no sim support)
	let fTime: WebGLUniformLocation | null = null;
	let fRes: WebGLUniformLocation | null = null;
	let fallbackProg: WebGLProgram | null = null;

	// ———— Shaders ————

	const VERT = `
		attribute vec2 a_position;
		void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
	`;

	const NOISE = `
		vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
		vec2 mod289(vec2 x){return x-floor(x*(1./289.))*289.;}
		vec3 permute(vec3 x){return mod289(((x*34.)+1.)*x);}
		float snoise(vec2 v){
			const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
			vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);
			vec2 i1=(x0.x>x0.y)?vec2(1,0):vec2(0,1);
			vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod289(i);
			vec3 p=permute(permute(i.y+vec3(0,i1.y,1))+i.x+vec3(0,i1.x,1));
			vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
			m=m*m;m=m*m;
			vec3 x=2.*fract(p*C.www)-1.;vec3 h=abs(x)-.5;
			vec3 ox=floor(x+.5);vec3 a0=x-ox;
			m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
			vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;
			return 130.*dot(m,g);
		}
	`;

	const SIM_FRAG = `
		precision highp float;
		uniform sampler2D u_state;
		uniform vec2 u_texel;
		uniform vec2 u_mouse;
		uniform float u_force;
		uniform float u_damping;

		void main(){
			vec2 uv=gl_FragCoord.xy*u_texel;
			vec4 s=texture2D(u_state,uv);
			float h=s.r, v=s.g;

			float l=texture2D(u_state,uv+vec2(-u_texel.x,0)).r;
			float r=texture2D(u_state,uv+vec2( u_texel.x,0)).r;
			float t=texture2D(u_state,uv+vec2(0, u_texel.y)).r;
			float b=texture2D(u_state,uv+vec2(0,-u_texel.y)).r;

			v+=(l+r+t+b-4.*h)*.24;
			v*=u_damping;
			h+=v;

			float d=distance(uv,u_mouse);
			h+=u_force*exp(-d*d*500.);

			h=clamp(h,-2.,2.);
			gl_FragColor=vec4(h,v,0,1);
		}
	`;

	const RENDER_FRAG = `
		precision highp float;
		uniform sampler2D u_state;
		uniform float u_time;
		uniform vec2 u_resolution;
		uniform vec2 u_simTexel;
		${NOISE}

		void main(){
			vec2 uv=gl_FragCoord.xy/u_resolution;
			float aspect=u_resolution.x/u_resolution.y;

			float h =texture2D(u_state,uv).r;
			float hL=texture2D(u_state,uv+vec2(-u_simTexel.x,0)).r;
			float hR=texture2D(u_state,uv+vec2( u_simTexel.x,0)).r;
			float hU=texture2D(u_state,uv+vec2(0, u_simTexel.y)).r;
			float hD=texture2D(u_state,uv+vec2(0,-u_simTexel.y)).r;
			vec2 norm=vec2(hL-hR,hD-hU);

			vec2 distorted=uv+norm*.06;
			vec2 uvA=vec2(distorted.x*aspect,distorted.y);

			float t=u_time*.06;
			float n1=snoise(uvA*1.8+vec2(t,t*.7));
			float n2=snoise(uvA*3.6-vec2(t*.8,t*1.1));
			float n3=snoise(uvA*7.2+vec2(t*.4,-t*.6));
			float liq=n1*.5+n2*.3+n3*.2;
			liq+=h*.8;

			float film=liq*.5+.5;
			vec3 sheen;
			sheen.r=sin(film*6.2832)*.5+.5;
			sheen.g=sin(film*6.2832+2.094)*.5+.5;
			sheen.b=sin(film*6.2832+4.189)*.5+.5;
			sheen=mix(sheen,vec3(.7,.72,.82)*sheen,.4);

			float act=abs(h)+length(norm)*2.;
			float hi=smoothstep(-.1,.6,liq)*.03;
			hi+=act*.025;
			hi=min(hi,.06);

			vec3 base=vec3(.035,.03,.03);
			vec3 col=base+sheen*hi;

			float vig=1.-smoothstep(.4,1.4,length(uv-.5)*1.8);
			col*=vig*.9+.1;

			gl_FragColor=vec4(col,1);
		}
	`;

	// Fallback: noise-only, no mouse pinning (just ambient oil)
	const FALLBACK_FRAG = `
		precision highp float;
		uniform float u_time;
		uniform vec2 u_resolution;
		${NOISE}

		void main(){
			vec2 uv=gl_FragCoord.xy/u_resolution;
			float aspect=u_resolution.x/u_resolution.y;
			vec2 uvA=vec2(uv.x*aspect,uv.y);

			float t=u_time*.06;
			float n1=snoise(uvA*1.8+vec2(t,t*.7));
			float n2=snoise(uvA*3.6-vec2(t*.8,t*1.1));
			float n3=snoise(uvA*7.2+vec2(t*.4,-t*.6));
			float liq=n1*.5+n2*.3+n3*.2;

			float film=liq*.5+.5;
			vec3 sheen;
			sheen.r=sin(film*6.2832)*.5+.5;
			sheen.g=sin(film*6.2832+2.094)*.5+.5;
			sheen.b=sin(film*6.2832+4.189)*.5+.5;
			sheen=mix(sheen,vec3(.7,.72,.82)*sheen,.4);

			float hi=smoothstep(-.1,.6,liq)*.08;
			vec3 col=vec3(.035,.03,.03)+sheen*hi;

			float vig=1.-smoothstep(.4,1.4,length(uv-.5)*1.8);
			col*=vig*.9+.1;

			gl_FragColor=vec4(col,1);
		}
	`;

	// ———— WebGL helpers ————

	function compileShader(src: string, type: number): WebGLShader | null {
		if (!gl) return null;
		const s = gl.createShader(type);
		if (!s) return null;
		gl.shaderSource(s, src);
		gl.compileShader(s);
		if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
			console.error('Shader error:', gl.getShaderInfoLog(s));
			gl.deleteShader(s);
			return null;
		}
		return s;
	}

	function linkProgram(fragSrc: string): WebGLProgram | null {
		if (!gl) return null;
		const vs = compileShader(VERT, gl.VERTEX_SHADER);
		const fs = compileShader(fragSrc, gl.FRAGMENT_SHADER);
		if (!vs || !fs) return null;
		const p = gl.createProgram();
		if (!p) return null;
		gl.attachShader(p, vs);
		gl.attachShader(p, fs);
		gl.bindAttribLocation(p, 0, 'a_position');
		gl.linkProgram(p);
		if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
			console.error('Link error:', gl.getProgramInfoLog(p));
			gl.deleteProgram(p);
			return null;
		}
		return p;
	}

	function createFBO(w: number, h: number, texType: number): { fbo: WebGLFramebuffer; tex: WebGLTexture } | null {
		if (!gl) return null;
		const tex = gl.createTexture();
		if (!tex) return null;
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, texType, null);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		const fbo = gl.createFramebuffer();
		if (!fbo) { gl.deleteTexture(tex); return null; }
		gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

		if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
			gl.deleteTexture(tex);
			gl.deleteFramebuffer(fbo);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			return null;
		}
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		return { fbo, tex };
	}

	function initSimFBOs() {
		if (!gl) return false;

		simW = Math.floor(canvas.width / 2);
		simH = Math.floor(canvas.height / 2);

		// Try float textures, then half-float
		const floatExt = gl.getExtension('OES_texture_float');
		gl.getExtension('OES_texture_float_linear');
		if (floatExt) {
			fboA = createFBO(simW, simH, gl.FLOAT);
			fboB = createFBO(simW, simH, gl.FLOAT);
			if (fboA && fboB) return true;
		}

		const hfExt = gl.getExtension('OES_texture_half_float');
		gl.getExtension('OES_texture_half_float_linear');
		if (hfExt) {
			fboA = createFBO(simW, simH, hfExt.HALF_FLOAT_OES);
			fboB = createFBO(simW, simH, hfExt.HALF_FLOAT_OES);
			if (fboA && fboB) return true;
		}

		return false;
	}

	function destroyFBOs() {
		if (!gl) return;
		if (fboA) { gl.deleteFramebuffer(fboA.fbo); gl.deleteTexture(fboA.tex); fboA = null; }
		if (fboB) { gl.deleteFramebuffer(fboB.fbo); gl.deleteTexture(fboB.tex); fboB = null; }
	}

	// ———— Init ————

	function initGL() {
		if (!canvas) return;
		gl = canvas.getContext('webgl', { alpha: false });
		if (!gl) return;

		// Fullscreen quad
		const buf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buf);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

		// Try fluid simulation path
		if (initSimFBOs()) {
			simProg = linkProgram(SIM_FRAG);
			renProg = linkProgram(RENDER_FRAG);

			if (simProg && renProg) {
				hasSim = true;

				gl.useProgram(simProg);
				sState = gl.getUniformLocation(simProg, 'u_state');
				sTexel = gl.getUniformLocation(simProg, 'u_texel');
				sMouse = gl.getUniformLocation(simProg, 'u_mouse');
				sForce = gl.getUniformLocation(simProg, 'u_force');
				sDamp  = gl.getUniformLocation(simProg, 'u_damping');

				gl.useProgram(renProg);
				rState    = gl.getUniformLocation(renProg, 'u_state');
				rTime     = gl.getUniformLocation(renProg, 'u_time');
				rRes      = gl.getUniformLocation(renProg, 'u_resolution');
				rSimTexel = gl.getUniformLocation(renProg, 'u_simTexel');
			} else {
				hasSim = false;
				destroyFBOs();
			}
		}

		// Fallback: noise-only
		if (!hasSim) {
			fallbackProg = linkProgram(FALLBACK_FRAG);
			if (fallbackProg) {
				gl.useProgram(fallbackProg);
				fTime = gl.getUniformLocation(fallbackProg, 'u_time');
				fRes  = gl.getUniformLocation(fallbackProg, 'u_resolution');
			}
		}

		startTime = performance.now();
	}

	// ———— Render loop ————

	function render() {
		if (!gl) return;
		const time = (performance.now() - startTime) / 1000;

		// Mouse force: builds with movement, decays when still
		const dx = mouseX - prevMouseX;
		const dy = mouseY - prevMouseY;
		const vel = Math.sqrt(dx * dx + dy * dy);
		mouseForce = Math.min(1.0, mouseForce + vel * 6.0);
		mouseForce *= 0.92;
		prevMouseX = mouseX;
		prevMouseY = mouseY;

		if (hasSim && simProg && renProg && fboA && fboB) {
			// Run 3 sim steps per frame for good propagation
			gl.useProgram(simProg);
			gl.uniform2f(sTexel, 1 / simW, 1 / simH);
			gl.uniform2f(sMouse, mouseX, mouseY);
			gl.uniform1f(sDamp, 0.955);

			for (let i = 0; i < 3; i++) {
				// Only apply force on first step to avoid tripling it
				gl.uniform1f(sForce, i === 0 ? mouseForce : 0);

				gl.bindTexture(gl.TEXTURE_2D, fboA.tex);
				gl.bindFramebuffer(gl.FRAMEBUFFER, fboB.fbo);
				gl.viewport(0, 0, simW, simH);
				gl.drawArrays(gl.TRIANGLES, 0, 6);

				// Swap
				const tmp = fboA;
				fboA = fboB;
				fboB = tmp;
			}

			// Render to screen
			gl.useProgram(renProg);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			gl.viewport(0, 0, canvas.width, canvas.height);
			gl.bindTexture(gl.TEXTURE_2D, fboA.tex);
			gl.uniform1f(rTime, time);
			gl.uniform2f(rRes, canvas.width, canvas.height);
			gl.uniform2f(rSimTexel, 1 / simW, 1 / simH);
			gl.drawArrays(gl.TRIANGLES, 0, 6);
		} else if (fallbackProg) {
			gl.useProgram(fallbackProg);
			gl.uniform1f(fTime, time);
			gl.uniform2f(fRes, canvas.width, canvas.height);
			gl.drawArrays(gl.TRIANGLES, 0, 6);
		}

		animationId = requestAnimationFrame(render);
	}

	// ———— Events ————

	function handleResize() {
		if (!canvas || !gl || !browser) return;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		gl.viewport(0, 0, canvas.width, canvas.height);

		if (hasSim) {
			destroyFBOs();
			if (!initSimFBOs()) {
				hasSim = false;
			}
		}
	}

	function handleMouseMove(e: MouseEvent) {
		mouseX = e.clientX / window.innerWidth;
		mouseY = 1.0 - e.clientY / window.innerHeight;
	}

	function handleTouchMove(e: TouchEvent) {
		const t = e.touches[0];
		if (t) {
			mouseX = t.clientX / window.innerWidth;
			mouseY = 1.0 - t.clientY / window.innerHeight;
		}
	}

	onMount(() => {
		if (!browser || !canvas) return;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		initGL();
		window.addEventListener('resize', handleResize);
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('touchmove', handleTouchMove, { passive: true });
		render();
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('touchmove', handleTouchMove);
			if (animationId) cancelAnimationFrame(animationId);
		}
	});
</script>

<canvas bind:this={canvas} class="absolute inset-0 h-full w-full" style="z-index: 0;"></canvas>
