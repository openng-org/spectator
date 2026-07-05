// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://openng-org.github.io/',
  base: '/spectator/',
	integrations: [
		starlight({
			title: 'Spectator',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/openng-org/spectator' }],
			sidebar: [
				{ label: 'Installation', slug: 'installation' },
				{
					label: 'Use Cases',
					items: [
						{ label: 'Testing Components', slug: 'testing-components' },
						{ label: 'Testing Directives', slug: 'testing-directives' },
						{ label: 'Testing Pipes', slug: 'testing-pipes' },
						{ label: 'Testing Services', slug: 'testing-services' },
						{ label: 'Testing with Host', slug: 'testing-with-host' },
						{ label: 'Testing with HTTP', slug: 'testing-with-http' },
						{ label: 'Testing with Routing', slug: 'testing-with-routing' },
						{ label: 'Testing Modules', slug: 'testing-modules' },
					],
				},
				{
					label: 'Tools',
					items: [
						{ label: 'Schematics', slug: 'schematics' },
						{ label: 'Custom Matchers', slug: 'custom-matchers' },
						{ label: 'Global Injections', slug: 'global-injections' },
						{ label: 'Mocking Components', slug: 'mocking-components' },
					],
				},
				{
					label: 'API Reference',
					items: [
						{ label: 'Events', slug: 'events' },
						{ label: 'Helpers', slug: 'helpers' },
						{ label: 'Queries', slug: 'queries' },
					],
				},
				{ label: 'Jest Support', slug: 'jest-support' },
				{ label: 'Vitest Support', slug: 'vitest-support' },
				{ label: 'Mocking Providers', slug: 'mocking-providers' },
			],
			customCss: ['./src/styles/global.css', './src/styles/custom.css'],
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
