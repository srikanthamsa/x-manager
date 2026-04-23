import cskLogo from '../assets/csk.png'
import kkrLogo from '../assets/kkr.png'
import miLogo from '../assets/mi.png'
import rcbLogo from '../assets/rcb.png'
import srhLogo from '../assets/srh.png'

import kohliImg from '../assets/players/kohli.png'
import dhoniImg from '../assets/players/dhoni.png'
import pandyaImg from '../assets/players/pandya.png'
import cumminsImg from '../assets/players/cummins.png'
import iyerImg from '../assets/players/iyer.png'

export interface TeamData {
  name: string
  shortName: string
  logo: string
  color: string
  manager: string
  nickname: string
  tagline: string
  captain?: string
  captainPhoto?: string
  captainFacing?: 'left' | 'right'
}

export const TEAMS: Record<string, TeamData> = {
  CSK: {
    name: 'Chennai Super Kings',
    shortName: 'CSK',
    logo: cskLogo,
    color: '#FDB913',
    manager: 'KVD',
    nickname: 'Thala',
    tagline: 'Whistle Podu',
    captain: 'MS Dhoni',
    captainPhoto: dhoniImg,
    captainFacing: 'left',
  },
  KKR: {
    name: 'Kolkata Knight Riders',
    shortName: 'KKR',
    logo: kkrLogo,
    color: '#3A225D',
    manager: 'Ekansh',
    nickname: 'The Unpredictable',
    tagline: 'Korbo Lorbo Jeetbo',
    captain: 'Shreyas Iyer',
    captainPhoto: iyerImg,
    captainFacing: 'left',
  },
  MI: {
    name: 'Mumbai Indians',
    shortName: 'MI',
    logo: miLogo,
    color: '#004BA0',
    manager: 'Debu',
    nickname: 'Hitman',
    tagline: 'Duniya Hila Denge',
    captain: 'Hardik Pandya',
    captainPhoto: pandyaImg,
    captainFacing: 'right',
  },
  RCB: {
    name: 'Royal Challengers Bengaluru',
    shortName: 'RCB',
    logo: rcbLogo,
    color: '#E4002B',
    manager: 'Srikant',
    nickname: 'The King',
    tagline: 'Ee Sala Cup Namde',
    captain: 'Virat Kohli',
    captainPhoto: kohliImg,
    captainFacing: 'left',
  },
  SRH: {
    name: 'Sunrisers Hyderabad',
    shortName: 'SRH',
    logo: srhLogo,
    color: '#FF822A',
    manager: 'Ashpak',
    nickname: 'Universe Boss',
    tagline: 'Rise with the Orange Army',
    captain: 'Pat Cummins',
    captainPhoto: cumminsImg,
    captainFacing: 'left',
  }
}

