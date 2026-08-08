const TIER_TO_UI_TOKEN: Record<string, string> = {
  member: 'team_member',
  lead: 'team_lead',
  tech_team: 'tech_team',
  vp: 'vp',
  manager: 'manager',
  admin: 'admin',
}

export const useTicketRoleMap = () => {
  const toTicketRole = (ticketTier: string | null | undefined): string | null => {
    if (!ticketTier) return null
    return TIER_TO_UI_TOKEN[ticketTier] ?? null
  }

  return { toTicketRole }
}
