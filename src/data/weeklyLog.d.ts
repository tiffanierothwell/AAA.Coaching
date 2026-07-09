export type WeekLog = {
  dates: string
  title: string
  intro: string
  highlights: { lead: string; body: string }[]
  builtLead: string
  bots: { name: string; initials: string; role: string }[]
  coordinators: string
  alongside: string
  walls: { lead: string; body: string }[]
  wrapUp: string
}
export declare const WEEKLY_LOG: WeekLog[]
