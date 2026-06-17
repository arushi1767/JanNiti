import { apiFetch } from './utils'

export interface PolicyQuery {
  query: string
  language?: string
  state?: string
}

export async function explainScheme(query: PolicyQuery) {
  return apiFetch('/api/explainer/explain', {
    method: 'POST',
    body: JSON.stringify(query),
  })
}

export async function detectConditions(query: PolicyQuery) {
  return apiFetch('/api/explainer/conditions', {
    method: 'POST',
    body: JSON.stringify(query),
  })
}

export async function getELI5(query: PolicyQuery) {
  return apiFetch('/api/explainer/eli5', {
    method: 'POST',
    body: JSON.stringify(query),
  })
}

export async function searchSchemes(q: string) {
  return apiFetch(`/api/explainer/search?q=${encodeURIComponent(q)}`)
}

export async function chatWithAI(message: string, language: string = 'en', conversationId?: string) {
  return apiFetch('/api/chat/message', {
    method: 'POST',
    body: JSON.stringify({ message, language, conversation_id: conversationId }),
  })
}

export async function compareSchemes(scheme1: string, scheme2: string, language: string = 'en') {
  return apiFetch('/api/compare/', {
    method: 'POST',
    body: JSON.stringify({ scheme1, scheme2, language }),
  })
}

export async function getDashboardStats() {
  return apiFetch('/api/dashboard/stats')
}
