<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { useGltf, Environment } from '@threlte/extras';
	import type { Group, PointLight, PerspectiveCamera, Mesh, MeshStandardMaterial } from 'three';

	interface Props {
		mouseX?: number;
		mouseY?: number;
	}

	let { mouseX = 0, mouseY = 0 }: Props = $props();

	let groupRef: Group | undefined = $state();
	let cameraRef: PerspectiveCamera | undefined = $state();
	let pointLightRef: PointLight | undefined = $state();
	let baseRotation = $state(0);

	// Mouse proximity drives light intensity and emissive
	const lightIntensityMin = 0.3;
	const lightIntensityMax = 1.2;
	const emissiveMin = 0.02;
	const emissiveMax = 0.15;
	let targetProximity = $state(0);
	let proximity = $state(0);
	let currentLightIntensity = $state(lightIntensityMin);
	let currentEmissive = $state(emissiveMin);

	const gltf = useGltf('/models/se-logo-simple.glb');

	// Track meshes for emissive updates
	let meshes: Mesh[] = $state([]);

	$effect(() => {
		if ($gltf?.scene) {
			const found: Mesh[] = [];
			$gltf.scene.traverse((child) => {
				if ((child as Mesh).isMesh) {
					found.push(child as Mesh);
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

		// Auto-rotation
		if (groupRef) {
			baseRotation += delta * 0.15;
			groupRef.rotation.y = baseRotation;
		}
	});
</script>

<T.PerspectiveCamera bind:ref={cameraRef} makeDefault position={[0, 0, 5]} fov={40} />

<T.DirectionalLight position={[10, 8, 5]} intensity={0.6} color="#FFF5E6" />
<T.DirectionalLight position={[-5, 2, -3]} intensity={0.15} color="#E8C17F" />
<T.AmbientLight intensity={0.05} />
<T.PointLight
	bind:ref={pointLightRef}
	position={[0, 0, 2]}
	intensity={currentLightIntensity}
	color="#E8C17F"
	distance={10}
	decay={1.2}
/>

<Environment url="/models/1k.hdr" />

<T.Group bind:ref={groupRef}>
	{#if $gltf?.scene}
		<T is={$gltf.scene} />
	{/if}
</T.Group>
