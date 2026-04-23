import { TEAMS } from './teams'

export interface MatchTeam {
  team: string
  fullName: string
  manager: string
  color: string
  logo: string
  captain?: string
  captainPhoto?: string
  captainFacing?: 'left' | 'right'
}

const t = (key: keyof typeof TEAMS): MatchTeam => ({
  team: TEAMS[key].shortName,
  fullName: TEAMS[key].name,
  manager: TEAMS[key].manager,
  color: TEAMS[key].color,
  logo: TEAMS[key].logo,
  captain: TEAMS[key].captain,
  captainPhoto: TEAMS[key].captainPhoto,
  captainFacing: TEAMS[key].captainFacing,
})

export interface Match {
  id: number
  home: MatchTeam
  away: MatchTeam
  venue: string
  status: 'upcoming' | 'live' | 'completed'
  result?: string
  winner?: string
  homeScore?: string
  awayScore?: string
}

export const MATCHES: Match[] = [
  { id: 1, home: t('KKR'), away: t('SRH'), venue: 'Eden Gardens', status: 'completed', result: 'KKR won by 12 runs', winner: 'KKR', homeScore: '187/5', awayScore: '175/8' },
  { id: 2, home: t('CSK'), away: t('RCB'), venue: 'MA Chidambaram', status: 'completed', result: 'RCB won by 6 wkts', winner: 'RCB', homeScore: '156/8', awayScore: '157/4' },
  { id: 3, home: t('SRH'), away: t('MI'), venue: 'Uppal Stadium', status: 'completed', result: 'SRH won by 4 runs', winner: 'SRH', homeScore: '198/4', awayScore: '194/7' },
  { id: 4, home: t('RCB'), away: t('KKR'), venue: 'Chinnaswamy Stadium', status: 'upcoming' },
  { id: 5, home: t('MI'), away: t('CSK'), venue: 'Wankhede Stadium', status: 'upcoming' },
  { id: 6, home: t('SRH'), away: t('RCB'), venue: 'Uppal Stadium', status: 'upcoming' },
  { id: 7, home: t('CSK'), away: t('KKR'), venue: 'MA Chidambaram', status: 'upcoming' },
  { id: 8, home: t('MI'), away: t('SRH'), venue: 'Wankhede Stadium', status: 'upcoming' },
  { id: 9, home: t('KKR'), away: t('CSK'), venue: 'Eden Gardens', status: 'upcoming' },
  { id: 10, home: t('RCB'), away: t('MI'), venue: 'Chinnaswamy Stadium', status: 'upcoming' },
  { id: 11, home: t('SRH'), away: t('CSK'), venue: 'Uppal Stadium', status: 'upcoming' },
  { id: 12, home: t('KKR'), away: t('RCB'), venue: 'Eden Gardens', status: 'upcoming' },
  { id: 13, home: t('MI'), away: t('KKR'), venue: 'Wankhede Stadium', status: 'upcoming' },
  { id: 14, home: t('CSK'), away: t('SRH'), venue: 'MA Chidambaram', status: 'upcoming' },
  { id: 15, home: t('RCB'), away: t('CSK'), venue: 'Chinnaswamy Stadium', status: 'upcoming' },
  { id: 16, home: t('SRH'), away: t('KKR'), venue: 'Uppal Stadium', status: 'upcoming' },
  { id: 17, home: t('MI'), away: t('RCB'), venue: 'Wankhede Stadium', status: 'upcoming' },
  { id: 18, home: t('KKR'), away: t('MI'), venue: 'Eden Gardens', status: 'upcoming' },
  { id: 19, home: t('RCB'), away: t('SRH'), venue: 'Chinnaswamy Stadium', status: 'upcoming' },
  { id: 20, home: t('CSK'), away: t('MI'), venue: 'MA Chidambaram', status: 'upcoming' },
  { id: 21, home: { team: 'TBD', fullName: 'Qualifier 1', manager: '–', color: '#5E6AD2', logo: '' }, away: { team: 'TBD', fullName: 'Qualifier 1', manager: '–', color: '#5E6AD2', logo: '' }, venue: 'TBD', status: 'upcoming' },
  { id: 22, home: { team: 'TBD', fullName: 'Eliminator', manager: '–', color: '#5E6AD2', logo: '' }, away: { team: 'TBD', fullName: 'Eliminator', manager: '–', color: '#5E6AD2', logo: '' }, venue: 'TBD', status: 'upcoming' },
  { id: 23, home: { team: 'TBD', fullName: 'Grand Final', manager: '–', color: '#FFD700', logo: '' }, away: { team: 'TBD', fullName: 'Grand Final', manager: '–', color: '#FFD700', logo: '' }, venue: 'TBD', status: 'upcoming' },
]

export const NEXT_MATCH = MATCHES.find(m => m.status === 'upcoming')!

export const TEAM_PLAYERS: Record<string, { name: string; role: string }[]> = {
  RCB: [
    { name: 'Virat Kohli', role: 'Batter' },
    { name: 'Faf du Plessis', role: 'Batter' },
    { name: 'Glenn Maxwell', role: 'All-rounder' },
    { name: 'Dinesh Karthik', role: 'Wicket-keeper' },
    { name: 'Wanindu Hasaranga', role: 'Bowler' },
    { name: 'Harshal Patel', role: 'Bowler' },
    { name: 'Mohammed Siraj', role: 'Bowler' },
    { name: 'Finn Allen', role: 'Batter' },
    { name: 'Shahbaz Ahmed', role: 'All-rounder' },
    { name: 'Akash Deep', role: 'Bowler' },
    { name: 'Reece Topley', role: 'Bowler' },
  ],
  KKR: [
    { name: 'Shreyas Iyer', role: 'Batter' },
    { name: 'Jason Roy', role: 'Batter' },
    { name: 'Venkatesh Iyer', role: 'All-rounder' },
    { name: 'Nitish Rana', role: 'Batter' },
    { name: 'Andre Russell', role: 'All-rounder' },
    { name: 'Rinku Singh', role: 'Batter' },
    { name: 'Sunil Narine', role: 'All-rounder' },
    { name: 'Tim Southee', role: 'Bowler' },
    { name: 'Varun Chakravarthy', role: 'Bowler' },
    { name: 'Harshit Rana', role: 'Bowler' },
    { name: 'Pat Cummins', role: 'All-rounder' },
  ],
  MI: [
    { name: 'Rohit Sharma', role: 'Batter' },
    { name: 'Ishan Kishan', role: 'Wicket-keeper' },
    { name: 'Suryakumar Yadav', role: 'Batter' },
    { name: 'Hardik Pandya', role: 'All-rounder' },
    { name: 'Tim David', role: 'Batter' },
    { name: 'Cameron Green', role: 'All-rounder' },
    { name: 'Tilak Varma', role: 'Batter' },
    { name: 'Jasprit Bumrah', role: 'Bowler' },
    { name: 'Piyush Chawla', role: 'Bowler' },
    { name: 'Jason Behrendorff', role: 'Bowler' },
    { name: 'Arjun Tendulkar', role: 'Bowler' },
  ],
  SRH: [
    { name: 'Abhishek Sharma', role: 'Batter' },
    { name: 'Travis Head', role: 'Batter' },
    { name: 'Mayank Agarwal', role: 'Batter' },
    { name: 'Harry Brook', role: 'Batter' },
    { name: 'Heinrich Klaasen', role: 'Wicket-keeper' },
    { name: 'Marco Jansen', role: 'All-rounder' },
    { name: 'Washington Sundar', role: 'All-rounder' },
    { name: 'Bhuvneshwar Kumar', role: 'Bowler' },
    { name: 'Umran Malik', role: 'Bowler' },
    { name: 'Shaheen Afridi', role: 'Bowler' },
    { name: 'Sanvir Singh', role: 'Bowler' },
  ],
  CSK: [
    { name: 'Ruturaj Gaikwad', role: 'Batter' },
    { name: 'Devon Conway', role: 'Batter' },
    { name: 'Ajinkya Rahane', role: 'Batter' },
    { name: 'Shivam Dube', role: 'All-rounder' },
    { name: 'Ambati Rayudu', role: 'Batter' },
    { name: 'MS Dhoni', role: 'Wicket-keeper' },
    { name: 'Moeen Ali', role: 'All-rounder' },
    { name: 'Ravindra Jadeja', role: 'All-rounder' },
    { name: 'Deepak Chahar', role: 'Bowler' },
    { name: 'Tushar Deshpande', role: 'Bowler' },
    { name: 'Matheesha Pathirana', role: 'Bowler' },
  ],
}
