import cskLogo from '../assets/csk.png'
import kkrLogo from '../assets/kkr.png'
import miLogo from '../assets/mi.png'
import rcbLogo from '../assets/rcb.png'
import srhLogo from '../assets/srh.png'

import kohliImg from '../assets/players/kohli.png'
import afridiImg from '../assets/players/afridi.png'
import akhtarImg from '../assets/players/akhtar.png'
import cumminsImg from '../assets/players/cummins.png'
import dhoniImg from '../assets/players/dhoni.png'
import iyerImg from '../assets/players/iyer.png'
import kishanImg from '../assets/players/kishan.png'
import pandyaImg from '../assets/players/pandya.png'
import kapilImg from '../assets/players/kapil.png'
import rohitImg from '../assets/players/rohit.png'

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
  captainPhoto2?: string
  captainFacing2?: 'left' | 'right'
  captain2?: string
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
    captainFacing: 'right',
    captainPhoto2: iyerImg,
    captainFacing2: 'left',
    captain2: 'Shreyas Iyer',
  },
  KKR: {
    name: 'Kolkata Knight Riders',
    shortName: 'KKR',
    logo: kkrLogo,
    color: '#3A225D',
    manager: 'Ekansh',
    nickname: 'The Unpredictable',
    tagline: 'Korbo Lorbo Jeetbo',
    captain: 'Pat Cummins',
    captainPhoto: cumminsImg,
    captainFacing: 'right',
    captainPhoto2: pandyaImg,
    captainFacing2: 'right',
    captain2: 'Hardik Pandya',
  },
  MI: {
    name: 'Mumbai Indians',
    shortName: 'MI',
    logo: miLogo,
    color: '#004BA0',
    manager: 'Debu',
    nickname: 'Hitman',
    tagline: 'Duniya Hila Denge',
    captain: 'Kapil Dev',
    captainPhoto: kapilImg,
    captainFacing: 'right',
    captainPhoto2: rohitImg,
    captainFacing2: 'right',
    captain2: 'Rohit Sharma',
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
    captainPhoto2: afridiImg,
    captainFacing2: 'left',
    captain2: 'Shahid Afridi',
  },
  SRH: {
    name: 'Sunrisers Hyderabad',
    shortName: 'SRH',
    logo: srhLogo,
    color: '#FF822A',
    manager: 'Ashpak',
    nickname: 'Universe Boss',
    tagline: 'Rise with the Orange Army',
    captain: 'Shoaib Akhtar',
    captainPhoto: akhtarImg,
    captainFacing: 'right',
    captainPhoto2: kishanImg,
    captainFacing2: 'right',
    captain2: 'Ishan Kishan',
  },
}
