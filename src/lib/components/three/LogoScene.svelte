<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { useGltf, Environment, OrbitControls } from '@threlte/extras';
	import type { Group, PointLight, Mesh } from 'three';
	import { MeshStandardMaterial, Color } from 'three';

	interface Props {
		mouseX?: number;
		mouseY?: number;
		isHome?: boolean;
		innerWidth?: number;
	}

	let { mouseX = 0, mouseY = 0, isHome = true, innerWidth = 1024 }: Props = $props();

	// Push camera back on narrow screens so logo doesn't clip edges
	let cameraZ = $derived(innerWidth < 640 ? 4.2 : 3);

	let groupRef: Group | undefined = $state();
	let pointLightRef: PointLight | undefined = $state();

	// Zoom-out: lerp group scale when leaving home
	const scaleHome = 1.0;
	const scaleAway = 0.7;
	let currentScale = $state(scaleHome);


	// Mouse proximity drives light intensity and emissive
	const lightIntensityMin = 0.3;
	const lightIntensityMax = 1.2;
	const emissiveMin = 0.02;
	const emissiveMax = 0.15;
	let targetProximity = $state(0);
	let proximity = $state(0);
	let currentLightIntensity = $state(lightIntensityMin);
	let currentEmissive = $state(emissiveMin);

	const gltf = useGltf('/3d/models/se-logo-simple.glb');

	let meshes: Mesh[] = $state([]);

	const silverColor = new Color('#C0C0C0');
	const goldColor = new Color('#C8960C');
	const currentColor = new Color('#C0C0C0');

	const material = new MeshStandardMaterial({
		color: currentColor.clone(),
		metalness: 1.0,
		roughness: 0.2,
		envMapIntensity: 1.5,
		transparent: false
	});

	$effect(() => {
		if ($gltf?.scene) {
			const found: Mesh[] = [];
			$gltf.scene.traverse((child) => {
				if ((child as Mesh).isMesh) {
					const mesh = child as Mesh;
					mesh.material = material;
					found.push(mesh);
				}
			});
			meshes = found;
		}
	});

	$effect(() => {
		const mouseDist = Math.sqrt(mouseX ** 2 + mouseY ** 2);
		const raw = Math.max(0, 1 - mouseDist * 2);
		targetProximity = raw * raw;
	});

	useTask((delta) => {
		// Lerp scale for zoom-out effect
		const targetScale = isHome ? scaleHome : scaleAway;
		currentScale += (targetScale - currentScale) * 0.04;
		if (groupRef) {
			groupRef.scale.setScalar(currentScale);
		}

		// Lerp colour: silver on home, gold away
		const targetColor = isHome ? silverColor : goldColor;
		currentColor.lerp(targetColor, 0.01);
		material.color.set(currentColor);

		// Smooth proximity
		proximity += (targetProximity - proximity) * 0.03;

		// Light intensity
		const targetLight = lightIntensityMin + (lightIntensityMax - lightIntensityMin) * proximity;
		currentLightIntensity += (targetLight - currentLightIntensity) * 0.05;
		if (pointLightRef) {
			pointLightRef.intensity = currentLightIntensity;
		}

		// Emissive intensity on meshes
		const targetEmissiveVal = emissiveMin + (emissiveMax - emissiveMin) * proximity;
		currentEmissive += (targetEmissiveVal - currentEmissive) * 0.05;
		meshes.forEach((mesh) => {
			const mat = mesh.material as MeshStandardMaterial;
			if (mat?.emissiveIntensity !== undefined) {
				mat.emissiveIntensity = currentEmissive;
			}
		});
	});
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, cameraZ]} fov={40}>
	<OrbitControls
		enableZoom={false}
		enablePan={false}
		enableDamping
		dampingFactor={0.05}
		rotateSpeed={0.5}
		autoRotate
		autoRotateSpeed={0.4}
	/>
</T.PerspectiveCamera>

<T.DirectionalLight position={[10, 8, 5]} intensity={0.6} color="#F0F0FF" />
<T.DirectionalLight position={[-5, 2, -3]} intensity={0.15} color="#C8C8D4" />
<T.AmbientLight intensity={0.05} />
<T.PointLight
	bind:ref={pointLightRef}
	position={[0, 0, 2]}
	intensity={currentLightIntensity}
	color="#B8B8CC"
	distance={10}
	decay={1.2}
/>

<Environment url="/3d/models/1k.hdr" />

<T.Group bind:ref={groupRef}>
	{#if $gltf?.scene}
		<T is={$gltf.scene} />
	{/if}
</T.Group>
