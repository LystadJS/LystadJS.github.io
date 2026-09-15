window.JSL_EMPIRICAL_DATA = {
  countryNames: {
    AF:"Afghanistan",AE:"United Arab Emirates",AM:"Armenia",AT:"Austria",AU:"Australia",AZ:"Azerbaijan",
    BD:"Bangladesh",BE:"Belgium",BF:"Burkina Faso",BG:"Bulgaria",BH:"Bahrain",BN:"Brunei",BR:"Brazil",CA:"Canada",CD:"Democratic Republic of the Congo",
    CM:"Cameroon",CN:"China",CY:"Cyprus",CZ:"Czechia",DE:"Germany",DJ:"Djibouti",DK:"Denmark",DZ:"Algeria",EE:"Estonia",EG:"Egypt",ES:"Spain",FI:"Finland",FR:"France",GB:"United Kingdom",
    GE:"Georgia",GR:"Greece",HR:"Croatia",HU:"Hungary",ID:"Indonesia",IE:"Ireland",IL:"Israel",IN:"India",IQ:"Iraq",IR:"Iran",IT:"Italy",JO:"Jordan",JP:"Japan",KG:"Kyrgyzstan",KR:"South Korea",
    KW:"Kuwait",KZ:"Kazakhstan",LB:"Lebanon",LK:"Sri Lanka",LT:"Lithuania",LU:"Luxembourg",LV:"Latvia",LY:"Libya",MA:"Morocco",ML:"Mali",MM:"Myanmar",MT:"Malta",MV:"Maldives",
    MX:"Mexico",MY:"Malaysia",MZ:"Mozambique",NE:"Niger",NG:"Nigeria",NL:"Netherlands",NP:"Nepal",OM:"Oman",PH:"Philippines",PK:"Pakistan",PL:"Poland",PS:"Palestine",PT:"Portugal",
    QA:"Qatar",RO:"Romania",RU:"Russia",SA:"Saudi Arabia",SE:"Sweden",SI:"Slovenia",SK:"Slovakia",SO:"Somalia",SY:"Syria",TD:"Chad",TJ:"Tajikistan",TN:"Tunisia",TR:"Turkey",TZ:"Tanzania",UA:"Ukraine",UG:"Uganda",US:"United States",YE:"Yemen"
  },

  scopeDefinitions: {
    research: [
      { id:"all", label:"Academic Research" },
      { id:"politicalViolence", label:"Political Violence" },
      { id:"terrorismResponses", label:"Terrorism and Responses to Terrorism" },
      { id:"anthropoceneHumanEcology", label:"Anthropocene Dynamics and Human Ecology" }
    ],
    applied: [
      { id:"all", label:"Applied Projects" },
      { id:"humanitarianResponse", label:"Humanitarian Response" },
      { id:"emergingTechnology", label:"Emerging Technology" },
      { id:"humanSecurity", label:"Human Security" }
    ],
    military: [
      { id:"all", label:"Military Service" },
      { id:"activeDuty", label:"Active-Duty" },
      { id:"armyReserves", label:"Army Reserves" },
      { id:"multinationalSecurity", label:"Multinational Security Cooperation" },
      { id:"specializedTraining", label:"Specialized Training" }
    ],
    journalism: [
      { id:"all", label:"Independent Reporting" },
      { id:"investigativeJournalism", label:"Investigative Journalism" },
      { id:"foreignCorrespondence", label:"Foreign Correspondence" }
    ]
  },

  researchProjects: {
    targetMap: {
      shortTitle:"Target Map",
      title:"The Caliphate's Target Map: Ethnosectarian Composition and Insurgent Violence in Iraq",
      status:"Published",year:"2026",
      question:"How closely did Islamic State attack patterns correspond to district-level ethnosectarian composition and target type?",
      themes:["Political violence","Terrorism"],
      systems:["Insurgent violence","Ethnosectarian geography","Civilian targeting"],
      challenges:["Spatial composition","Event heterogeneity","Target-type variation"],
      methods:["Population-weighted geography","Statistical modeling","Data visualization"],
      scopes:["politicalViolence","terrorismResponses"],
      countries:["IQ"],href:"research.html#paper-target-map"
    },
    lethality: {
      shortTitle:"Estimating Lethality",
      title:"Estimating Lethality Under Missing Casualty Data: Suicide Attacks in Islamic State-Linked Terrorism",
      status:"Published",year:"2026",
      question:"How do missing casualty observations and perpetrator-attribution bias alter estimates of lethality in Islamic State-linked suicide attacks?",
      themes:["Terrorism","Missing data"],systems:["Suicide attacks","Islamic State-linked terrorism","Attack lethality"],
      challenges:["Missing casualty data","Attribution bias","Cross-country event data"],methods:["Missing-data analysis","Comparative event analysis","R"],
      scopes:["politicalViolence","terrorismResponses"],
      countries:["AF","DZ","AU","BH","BD","BE","BF","CM","TD","CD","EG","FR","GE","DE","IN","ID","IR","IQ","IL","JO","KZ","KW","KG","LB","LY","MY","MV","ML","MZ","NE","NG","PK","PH","RU","SA","SO","LK","SY","TJ","TZ","TN","TR","UG","GB","PS","YE"],href:"research.html#paper-estimating-lethality"
    },
    climate: {
      shortTitle:"Climate Change",
      title:"The Effects of Climate Change on the Development of Terrorist Networks in the Middle East and North Africa",
      status:"Published",year:"2022",
      question:"How could projected climate stress intensify resource scarcity, governance pressure, and conditions exploitable by terrorist organizations across the Middle East and North Africa?",
      themes:["Climate risk","Human security","Terrorism"],systems:["Climate stress","Resource scarcity","Terrorist network development"],
      challenges:["Scenario uncertainty","Cross-country climate exposure","Multi-source integration"],methods:["Climate scenario comparison","Spatial analysis","Data visualization"],
      scopes:["terrorismResponses","anthropoceneHumanEcology"],
      countries:["DZ","BH","DJ","EG","IR","IQ","IL","JO","KW","LB","LY","MA","OM","QA","SA","SY","TN","AE","PS","YE"],href:"research.html#paper-climate-terrorism"
    },
    vanguards: {
      shortTitle:"Vanguards of Terror",
      title:"Vanguards of Terror: The Strategic and Tactical Orientation and Cohesion of the Islamic State Insurgency, 1999–2019",
      status:"Published",year:"2022",
      question:"How consistent were the strategic and tactical behaviors of Islamic State wilayat across the movement's geographic expansion through 2019?",
      themes:["Terrorism","Organizational behavior"],systems:["Islamic State wilayat","Tactical cohesion","Strategic variation"],
      challenges:["Cross-unit comparability","Longitudinal conflict data","Organizational heterogeneity"],methods:["Comparative analysis","Longitudinal analysis","OSINT"],
      scopes:["politicalViolence","terrorismResponses"],
      countries:["AF","DZ","AM","AZ","BD","BN","BF","CM","TD","CD","EG","GE","IN","ID","IQ","LY","MY","ML","MZ","NE","NG","PK","PH","RU","SA","SO","SY","TZ","TN","TR","UG","YE"],href:"research.html#paper-vanguards"
    }
  },

  unProjects: {
    floodResponse: {
      title:"Himalayan Flood Response: Humanitarian Access and Response Effectiveness along the Nepalese-Chinese Border",
      status:"Applied project",
      summary:"An applied analysis focused on humanitarian access and response effectiveness in a difficult cross-border operating environment.",
      themes:["Humanitarian","Access","Operational analysis"],systems:["Cross-border humanitarian access","Disaster response effectiveness"],
      challenges:["Cross-border operating environment","Access constraints","Response evaluation"],methods:["Operational analysis"],
      scopes:["humanitarianResponse","humanSecurity"],
      countries:["NP","CN"],global:false,href:"research.html#project-himalayan-flood"
    },
    foodUnderFire: {
      title:"Food Under Fire",
      status:"Applied project",
      summary:"UN-facing analytical work related to the Food Under Fire agenda item, focused on the interaction between armed conflict, food insecurity, humanitarian access, and civilian protection.",
      themes:["United Nations","Food security","Humanitarian response"],systems:["Conflict-related food insecurity","Humanitarian access","Civilian protection"],
      challenges:["Conflict-driven food insecurity","Humanitarian access constraints","Cross-context evidence synthesis"],methods:["Policy analysis","Comparative multilateral analysis"],
      scopes:["humanitarianResponse","humanSecurity"],
      countries:[],global:true,href:"research.html#project-food-under-fire"
    },
    protectingAidWorkers: {
      title:"Protecting Aid Workers",
      status:"Applied project",
      summary:"UN-facing analytical work related to the Protecting Aid Workers agenda item, focused on threats to humanitarian personnel, operating access, and protection challenges across conflict environments.",
      themes:["United Nations","Humanitarian protection","Human security"],systems:["Humanitarian operations","Aid worker protection","Conflict environments"],
      challenges:["Threats to humanitarian personnel","Access constraints","Cross-conflict comparison"],methods:["Policy analysis","Comparative multilateral analysis"],
      scopes:["humanitarianResponse","humanSecurity"],
      countries:[],
      mapCountries:["SY","MM","PS","IL","RU","UA","LB","IR"],
      global:true,href:"research.html#project-protecting-aid-workers"
    },
    aiNonProliferation: {
      title:"Artificial Intelligence Non-Proliferation at the United Nations and across the Multilateral Ecosystem",
      status:"Applied project",
      summary:"Policy-oriented work examining AI non-proliferation in UN and multilateral settings, with emphasis on translating technical change into governance questions.",
      themes:["United Nations","AI governance","Multilateral policy"],systems:["UN and multilateral governance","Emerging technology governance"],
      challenges:["Cross-institutional policy comparison","Rapid technical change"],methods:["Policy analysis","Comparative multilateral analysis"],
      scopes:["emergingTechnology","humanSecurity"],
      countries:[],
      mapCountries:["CN","US","AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE","JP","KR","BR","IN","IL","SA","AE"],
      global:true,href:"research.html#project-ai-nonproliferation"
    },
    autonomousWeapons: {
      title:"Countering autonomous weapons proliferation",
      status:"Applied project",
      summary:"An applied policy project on the proliferation risks created by increasingly accessible autonomous systems and enabling technologies.",
      themes:["Autonomy","Security","Non-proliferation"],systems:["Autonomous systems","Technology proliferation"],
      challenges:["Technology diffusion","Dual-use capability","Multilateral coordination"],methods:["Policy analysis","Risk assessment"],
      scopes:["emergingTechnology","humanSecurity"],
      countries:[],
      mapCountries:["CN","US","AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE","JP","KR","BR","IN","IL","SA","AE"],
      global:true,href:"research.html#project-autonomous-weapons"
    },
    ambassadorAdvising: {
      title:"Statistical analysis for policy and Ambassador-level advising",
      status:"Applied project",
      summary:"Public descriptions of analyses used to support senior decision-making in State Department and United Nations contexts.",
      themes:["Statistics","Decision support","Policy"],systems:["Senior decision support","United Nations policy contexts"],
      challenges:["Decision-making under uncertainty","Translation of analysis to policy"],methods:["Statistical analysis","Decision support"],
      scopes:["humanSecurity"],
      countries:[],global:true,href:"research.html#project-ambassador-advising"
    }
  },

  /* Military-service countries can belong to more than one scope. */
  armyProjects: {
    armyJapan: {
      shortTitle:"Japan",title:"U.S. Army Experience — Japan",status:"Details forthcoming",
      summary:"Country-specific Army experience reserved for later expansion.",
      themes:["U.S. Army","Leadership","Operational experience"],systems:["Military service","Operational environment"],
      challenges:["Details forthcoming"],methods:["Leadership","Operational analysis"],
      scopes:["activeDuty","multinationalSecurity"],countries:["JP"],href:null
    },
    armyUnitedStates: {
      shortTitle:"United States",title:"U.S. Army Experience — United States",status:"Details forthcoming",
      summary:"Country-specific Army experience reserved for later expansion.",
      themes:["U.S. Army","Leadership","Operational experience"],systems:["Military service","Operational environment"],
      challenges:["Details forthcoming"],methods:["Leadership","Operational analysis"],
      scopes:["activeDuty","armyReserves","specializedTraining"],countries:["US"],href:null
    },
    armyCanada: {
      shortTitle:"Canada",title:"U.S. Army Experience — Canada",status:"Details forthcoming",
      summary:"Country-specific Army experience reserved for later expansion.",
      themes:["U.S. Army","Leadership","Operational experience"],systems:["Military service","Operational environment"],
      challenges:["Details forthcoming"],methods:["Leadership","Operational analysis"],
      scopes:["activeDuty","multinationalSecurity"],countries:["CA"],href:null
    }
  },

  /* Reporting records can belong to Investigative Journalism, Foreign Correspondence, or both. */
  journalismProjects: {
    journalismUnitedStates: {
      shortTitle:"United States",title:"Journalistic Work — United States",status:"Details forthcoming",
      summary:"Country-specific journalism work reserved for later expansion.",
      themes:["Journalism","Reporting","Writing"],systems:["Public affairs","Field reporting"],
      challenges:["Details forthcoming"],methods:["Reporting","Research","Writing"],
      scopes:["investigativeJournalism"],countries:["US"],href:null
    },
    journalismMorocco: {
      shortTitle:"Morocco",title:"Journalistic Work — Morocco",status:"Details forthcoming",
      summary:"Country-specific journalism work reserved for later expansion.",
      themes:["Journalism","Reporting","Writing"],systems:["Public affairs","Field reporting"],
      challenges:["Details forthcoming"],methods:["Reporting","Research","Writing"],
      scopes:["investigativeJournalism","foreignCorrespondence"],countries:["MA"],href:null
    },
    journalismSpain: {
      shortTitle:"Spain",title:"Journalistic Work — Spain",status:"Details forthcoming",
      summary:"Country-specific journalism work reserved for later expansion.",
      themes:["Journalism","Reporting","Writing"],systems:["Public affairs","Field reporting"],
      challenges:["Details forthcoming"],methods:["Reporting","Research","Writing"],
      scopes:["investigativeJournalism","foreignCorrespondence"],countries:["ES"],href:null
    },
    journalismFrance: {
      shortTitle:"France",title:"Journalistic Work — France",status:"Details forthcoming",
      summary:"Country-specific journalism work reserved for later expansion.",
      themes:["Journalism","Reporting","Writing"],systems:["Public affairs","Field reporting"],
      challenges:["Details forthcoming"],methods:["Reporting","Research","Writing"],
      scopes:["investigativeJournalism","foreignCorrespondence"],countries:["FR"],href:null
    },
    journalismAlgeria: {
      shortTitle:"Algeria",title:"Journalistic Work — Algeria",status:"Details forthcoming",
      summary:"Country-specific journalism work reserved for later expansion.",
      themes:["Journalism","Reporting","Writing"],systems:["Public affairs","Field reporting"],
      challenges:["Details forthcoming"],methods:["Reporting","Research","Writing"],
      scopes:["investigativeJournalism","foreignCorrespondence"],countries:["DZ"],href:null
    }
  }
};