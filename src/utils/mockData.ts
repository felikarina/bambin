export const fakeUsers = [
  {
    idUser: "user-1",
    firstname: "Léa",
    lastname: "Moreau",
    email: "lea.moreau@email.com",
    role: "parent",
  },
  {
    idUser: "user-2",
    firstname: "Thomas",
    lastname: "Moreau",
    email: "thomas.moreau@email.com",
    role: "parent",
  },
  {
    idUser: "user-3",
    firstname: "Yanis",
    lastname: "Benali",
    email: "yanis.benali@email.com",
    role: "admin",
  },
  {
    idUser: "user-4",
    firstname: "Chloé",
    lastname: "Nguyen",
    email: "chloe.nguyen@email.com",
    role: "nurseryStaff",
  },
  {
    idUser: "user-5",
    firstname: "Lucas",
    lastname: "Dubois",
    email: "lucas.dubois@email.com",
    role: "parent",
  },
  {
    idUser: "user-6",
    firstname: "Marie",
    lastname: "Dubois",
    email: "marie.dubois@email.com",
    role: "parent",
  },
  {
    idUser: "user-7",
    firstname: "Fatou",
    lastname: "Sow",
    email: "fatou.sow@email.com",
    role: "nurseryStaff",
  },
  {
    idUser: "user-8",
    firstname: "Enzo",
    lastname: "Rossi",
    email: "enzo.rossi@email.com",
    role: "admin",
  },
];

export const fakeChildren = [
  {
    idChild: "child-1",
    firstname: "Emma",
    lastname: "Moreau",
    birthDate: "2020-03-15",
    userId: "user-1",
    userId2: "user-2",
  },
  {
    idChild: "child-2",
    firstname: "Léo",
    lastname: "Dubois",
    birthDate: "2019-08-22",
    userId: "user-5",
    userId2: "user-6",
  },
  {
    idChild: "child-3",
    firstname: "Jade",
    lastname: "Moreau",
    birthDate: "2021-01-10",
    userId: "user-1",
    userId2: "user-2",
  },
  {
    idChild: "child-4",
    firstname: "Hugo",
    lastname: "Dubois",
    birthDate: "2020-11-05",
    userId: "user-5",
  },
  {
    idChild: "child-5",
    firstname: "Alice",
    lastname: "Moreau",
    birthDate: "2022-06-12",
    userId: "user-1",
    userId2: "user-2",
  },
];

export const fakeSections = [
  {
    idSection: "section-1",
    name: "Petit",
    year: 2024,
    numberOfChild: 15,
  },
  {
    idSection: "section-2",
    name: "Moyen",
    year: 2024,
    numberOfChild: 18,
  },
  {
    idSection: "section-3",
    name: "Grand",
    year: 2024,
    numberOfChild: 20,
  },
];

export const fakeChildSections = [
  {
    idChildSection: "child-section-1",
    childId: "child-1",
    sectionName: "petit",
  },
  {
    idChildSection: "child-section-2",
    childId: "child-2",
    sectionName: "moyen",
  },
  {
    idChildSection: "child-section-3",
    childId: "child-3",
    sectionName: "petit",
  },
  {
    idChildSection: "child-section-4",
    childId: "child-4",
    sectionName: "grand",
  },
  {
    idChildSection: "child-section-5",
    childId: "child-5",
    sectionName: "petit",
  },
];
