export interface GP {
  id_api_races: number;
  season: string;
  date: string;
  time: string;
  id_api_track: number;
}

export interface Track {
  id_api_races: number;
  country_name: string;
  track_name: string;
  picture_country?: string;
  picture_track?: string;
}

export interface Pilote {
  id_api_pilotes: string;
  name: string;
  picture?: string;
  name_acronym: string;
}

export interface League {
  id_league: number;
  name: string;
  shared_link: string;
  private: boolean;
  active: boolean;
}