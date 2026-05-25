import { inject } from 'vue'

export const TOOL_CONTEXT_KEY = Symbol('toolContext')

/**
 * 子功能面板内获取当前工具上下文
 * @returns {import('./types').ToolContext}
 */
export function useToolContext() {
  const ctx = inject(TOOL_CONTEXT_KEY)
  if (!ctx) {
    console.warn('[useToolContext] 请在 ToolShell 子组件内使用')
  }
  return ctx
}
