<script lang="ts">
  import { T } from '@threlte/core'
  import { AutoColliders, RigidBody } from '@threlte/rapier'
  import { RadialGradientTexture, type GradientStop } from '@threlte/extras'
  import { onMount } from 'svelte'
  // Add a color prop with a default value matching the sidebar background
  export let color: string = '#f9fafb';

	let Stop1 = color;
  let Stop2 = '#A9A9A9';

  onMount(() => {
    const computedStyle = getComputedStyle(document.documentElement)
    Stop1 = color || computedStyle.getPropertyValue('--sidebar-background').trim() || Stop1
    Stop2 = computedStyle.getPropertyValue('--border-color').trim() || Stop2
  })

</script>

<RigidBody type="fixed">
  <T.Group position={[0, -.5, 0]}>
    <AutoColliders shape={'cuboid'}>
      <T.Mesh receiveShadow>
        <T.BoxGeometry args={[5000, .95, 5000]} />
        <T.MeshBasicMaterial>
          <RadialGradientTexture
            stops={[
              { color: Stop1, offset: 0 },
              { color: Stop2, offset: 1 },
            ]}
            innerRadius={0}
            outerRadius={'auto'}
          />
        </T.MeshBasicMaterial>
      </T.Mesh>
    </AutoColliders>
  </T.Group>
</RigidBody>
