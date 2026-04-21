// ============================================================================
// Mock Automations Data — Available automated actions
// ============================================================================

import type { AutomationAction } from '@/types/workflow'

export const mockAutomations: AutomationAction[] = [
  {
    id: 'send_email',
    label: 'Send Email',
    params: ['to', 'subject', 'body'],
  },
  {
    id: 'generate_doc',
    label: 'Generate Document',
    params: ['template', 'recipient'],
  },
  {
    id: 'notify_slack',
    label: 'Notify Slack',
    params: ['channel', 'message'],
  },
  {
    id: 'update_hris',
    label: 'Update HRIS',
    params: ['employee_id', 'field', 'value'],
  },
  {
    id: 'send_sms',
    label: 'Send SMS',
    params: ['phone', 'message'],
  },
]
