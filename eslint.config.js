import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintPluginTypeScript from '@typescript-eslint/eslint-plugin'

const compat = new FlatCompat()

export default [
	js.configs.recommended,
	...compat.extends('next/core-web-vitals'),
	...compat.extends('plugin:react/recommended'),
	...compat.extends('plugin:react-hooks/recommended'),
	...compat.extends('plugin:jsx-a11y/recommended'),
	...compat.extends('prettier'),
	{
		ignores: [
			'.next/**',
			'node_modules/**',
			'build/**',
			'dist/**',
			'*.config.js',
			'*.config.mjs',
		],
		plugins: {
			'@typescript-eslint': eslintPluginTypeScript,
			react: eslintPluginReact,
			'react-hooks': eslintPluginReactHooks,
			'jsx-a11y': eslintPluginJsxA11y,
			prettier: eslintPluginPrettier,
		},
		rules: {
			// react import 누락 무시
			'react/react-in-jsx-scope': 'off',
			// 미사용 변수 무시
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			// no-undef 무시
			'no-undef': 'off',
			// unreachable code 무시
			'no-unreachable': 'off',
			// React Hooks 관련 무시
			'react-hooks/exhaustive-deps': 'off',
			'react-hooks/rules-of-hooks': 'off',
			// 접근성 관련 무시
			'jsx-a11y/heading-has-content': 'off',
			'jsx-a11y/anchor-has-content': 'off',
			'jsx-a11y/label-has-associated-control': 'off',
			// React 관련 무시
			'react/no-unescaped-entities': 'off',
			'react/no-unknown-property': 'off',
			// Next.js 관련 무시
			'@next/next/no-img-element': 'off',
			'@next/next/no-assign-module-variable': 'off',
			// TypeScript 관련 무시
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			// 기타 기존 룰
			'prettier/prettier': 'off',
			'react/prop-types': 'off',
		},
	},
]
