export interface IAvalancheProblemType {
  ids: number[];
  imageName: string;
  description: string;
}

export const avalancheProblems = {
  ikkeangitt: { ids: [0], imageName: "ikkeangitt", description: "Ikke angitt" },
  nysno: {
    ids: [3, 7, 20],
    imageName: "nysno",
    description: "Nysnø (flakskred og løssnøskred)",
  },
  fokksno: {
    ids: [10],
    imageName: "fokksno",
    description: "Fokksnø (flakskred)",
  },
  vedvarendeSvaktLag: {
    ids: [30],
    imageName: "vedvarendesvaktlag",
    description: "Vedvarende svakt lag (flakskred)",
  },
  vatsno: {
    ids: [5, 40, 45],
    imageName: "vatsno",
    description: "Våt snø (flakskred og løssnøskred)",
  },
  glideskred: {
    ids: [50],
    imageName: "glideskred",
    description: "Glideskred (flakskred)",
  },
};

export const mapFromAvalancheProblemTypeIdToImage = (
  id: number
): IAvalancheProblemType => {
  // id'er herfra: http://api.nve.no/doc/snoeskredvarsel/#avalanchewarningbycoordinates
  // beskrivelser herfra: https://www.varsom.no/snoskredskolen/snoskredproblemer/

  if (avalancheProblems.ikkeangitt.ids.includes(id))
    return avalancheProblems.ikkeangitt;
  else if (avalancheProblems.nysno.ids.includes(id))
    return avalancheProblems.nysno;
  else if (avalancheProblems.fokksno.ids.includes(id))
    return avalancheProblems.fokksno;
  else if (avalancheProblems.vedvarendeSvaktLag.ids.includes(id))
    return avalancheProblems.vedvarendeSvaktLag;
  else if (avalancheProblems.vatsno.ids.includes(id))
    return avalancheProblems.vatsno;
  else if (avalancheProblems.glideskred.ids.includes(id))
    return avalancheProblems.glideskred;
  else return avalancheProblems.ikkeangitt;
};
