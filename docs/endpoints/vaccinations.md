# Vaccinations

## `/vaccinations`

### Request

`GET https://api.corona-zahlen.org/vaccinations`
[Open](/vaccinations)

### Response

`administeredVaccinations` The total number of administered vaccine doses (sum of first, second, 1st booster and 2nd booster vaccination)

`vaccinated` Number of people who got the first vaccination.

`vaccination.biontech` Number of people who were vaccinated with BioNTech

`vaccination.moderna` Number of people who were vaccinated with Moderna

`vaccination.astraZeneca` Number of people who were vaccinated with AstraZeneca

`vaccination.janssen` Number of people who were vaccinated with Janssen

`vaccination.novavax` Number of people who were vaccinated with Novavax

`vaccination.deltaBiontech` New first vaccination with biontech vaccine compared to last reporting day

`vaccination.deltaModerna` New first vaccination with moderna vaccine compared to last reporting day

`vaccination.deltaAstraZeneca` New first vaccination with astra zeneca vaccine compared to last reporting day

`vaccination.deltaJanssen` New first vaccination with janssen vaccine compared to last reporting day

`vaccination.deltaNovavax` New first vaccination with novavax vaccine compared to last reporting day

`delta` New first vaccination compared to last reporting day

`quote` Quote of first vaccinated people (legacy)

`quotes` Quotes by agegroups

`quotes.total` Quote of first vaccinated people (same as `quote`)

`quotes.A05-A17` Quote of first vaccinated people in age-group < 18 years

`quotes.A05-A17.total` Quote of first vaccinated people with age < 18 years

`quotes.A05-A17.A05-A11` Quote of first vaccinated people with age >=5 to <=11 years

`quotes.A05-A17.A12-A17` Quote of first vaccinated people with age >=12 to <=17 years

`quotes.A18+` Quote of first vaccinated people in agegroup >= 18 years

`quotes.A18+.total` Quote of first vaccinated people with age >= 18 years

`quotes.A18+.A18-A59` Quote of first vaccinated people with age >= 18 to <= 59 years

`quotes.A18+.A60+` Quote of first vaccinated people with age >= 60 years

`secondVaccination.vaccinated` Number of people who got the second vaccination

`secondVaccination.vaccination.biontech` Number of people who received their second dose of BioNTech

`secondVaccination.vaccination.moderna` Number of people who received their second dose of Moderna

`secondVaccination.vaccination.astraZeneca` Number of people who received their second dose of AstraZeneca

`secondVaccination.vaccination.janssen` Number of people who received their second dose of Janssen

`secondVaccination.vaccination.novavax` Number of people who received their second dose of Novavax

`secondVaccination.vaccination.deltaBiontech` New second vaccination with biontech vaccine compared to last reporting day

`secondVaccination.vaccination.deltaModerna` New second vaccination with moderna vaccine compared to last reporting day

`secondVaccination.vaccination.deltaAstraZeneca` New second vaccination with astra zeneca vaccine compared to last reporting day

`secondVaccination.vaccination.deltaJanssen` New second vaccination with janssen vaccine compared to last reporting day

`secondVaccination.vaccination.deltaNovavax` New second vaccination with novavax vaccine compared to last reporting day

`secondVaccination.delta` New second vaccinations compared to yesterday

`secondVaccination.quote` Quote of full vaccinated people (legacy)

`secondVaccination.quotes` Quotes of full vaccinated people by agegroups

`secondVaccination.quotes.total` Quote of full vaccinated people (same as `secondVaccination.quote`)

`secondVaccination.quotes.A05-A17` Quote of full vaccinated people in age-group < 18 years

`secondVaccination.quotes.A05-A17.total` Quote of full vaccinated people with age < 18 years

`secondVacciantion.quotes.A05-A17.A05-A11` Quote of full vaccinated people with age >=5 to <=11 years

`secondVaccination.quotes.A05-A17.A12-A17` Quote of full vaccinated people with age >=12 to <=17 years

`secondVaccination.quotes.A18+` Quote of full vaccinated people with agegroup >= 18 years

`secondVaccination.quotes.A18+.total` Quote of full vaccinated people with age >= 18 years

`secondVaccination.quotes.A18+.A18-A59` Quote of full vaccinated people with age >= 18 to <= 59 years

`secondVaccination.quotes.A18+.A60+` Quote of full vaccinated people with age >= 60 years

`boostervaccination.vaccinated` Number of people who got the booster vaccination

`boosterVaccination.vaccination.biontech` Number of people who received their booster dose of BioNTech

`boosterVaccination.vaccination.moderna` Number of people who received their booster dose of Moderna

`boosterVaccination.vaccination.janssen` Number of people who received their booster dose of Janssen

`boosterVaccination.vaccination.deltaBiontech` New first booster vaccination with biontech vaccine compared to last reporting day

`boosterVaccination.vaccination.deltaModerna` New first booster with moderna vaccine compared to last reporting day

`boosterVaccination.vaccination.deltaAstraZeneca` New first booster with astra zeneca vaccine compared to last reporting day

`boosterVaccination.vaccination.deltaJanssen` New first booster with janssen vaccine compared to last reporting day

`boosterVaccination.vaccination.deltaNovavax` New first booster with novavax vaccine compared to last reporting day

`boosterVaccination.delta` New booster vaccinations compared to yesterday

`boosterVaccination.quote` Quote of boostered people (legacy)

`boosterVaccination.quotes` Quotes of boostered people by agegroups

`boosterVaccination.quotes.total` Quote of boostered people (same as `boosterVaccination.quote`)

`boosterVaccination.quotes.A05-A17` Quote of boostered people in age-group < 18 years

`boosterVacciantion.quotes.A05-A17.total` Quote of boostered people with age < 18 years

`boosterVaccination.quotes.A05-A17.A05-A11` Quote of boostered people with age >=5 to <=11 years

`boosterVaccination.quotes.A05-A17.A12-A17` Quote of boostered people with age >=12 to <=17 years

`boosterVaccination.quotes.A18+` Quote of boostered people with agegroup >= 18 years

`boosterVaccination.quotes.A18+.total` Quote of boostered people with age >= 18 years

`boosterVaccination.quotes.A18+.A18-A59` Quote of boostered people with age >= 18 to <= 59 years

`boosterVaccination.quotes.A18+.A60+` Quote of boostered people with age >= 60 years

`2ndBoosterVaccination` as described for `boosterVaccination`

_ATTENTION_ since 2021-04-08 the RKI dropped the indication information!

```json
{
  "data": {
    "administeredVaccinations":178553363,
    "vaccinated":64498951,
    "vaccination": {
      "biontech":46309524,
      "moderna":5108082,
      "astraZeneca":9336101,
      "janssen":3686211,
      "novavax":106972,
      "deltaBiontech":1050,
      "deltaModerna":81,
      "deltaAstraZeneca":2,
      "deltaJanssen":8,
      "deltaNovavax":705
    },
    "delta":1429,
    "quote":0.776,
    "quotes": {
      "total":0.776,
      "A05-A17": {
        "total":0.452,
        "A05-A11":0.22,
        "A12-A17":0.722
      },
      "A18+": {
        "total":0.866,
        "A18-A59":0.833,
        "A60+":0.916
      }
    },
    "secondVaccination": {
      "vaccinated":63010774,
      "vaccination": {
        "biontech":50805150,
        "moderna":6342278,
        "astraZeneca":3533141,
        "janssen":10806,
        "novavax":null,
        "deltaBiontech":2582,
        "deltaModerna":200,
        "deltaAstraZeneca":3,
        "deltaJanssen":5,
        "deltaNovavax":0
      },
      "delta":3207,
      "quote":0.758,
      "quotes": {
        "total":0.758,
        "A05-A17": {
          "total":0.411,
          "A05-A11":0.193,
          "A12-A17":0.665},
          "A18+": {
            "total":0.85,
            "A18-A59":0.819,
            "A60+":0.908
          }
        }
      },
      "boosterVaccination": {
        "vaccinated":49318858,
        "vaccination": {
          "biontech":31176173,
          "moderna":18115596,
          "astraZeneca":6175,
          "janssen":18338,
          "novavax":2576,
          "deltaBiontech":5847,
          "deltaModerna":1577,
          "deltaAstraZeneca":0,
          "deltaJanssen":2,
          "deltaNovavax":63
        },
        "delta":7489,
        "quote":0.593,
        "quotes": {
          "total":0.593,
          "A05-A17": {
            "total":0.307,
            "A05-A11":null,
            "A12-A17":0.307
          },
          "A18+": {
            "total":0.689,
            "A18-A59":0.631,
            "A60+":0.797
          }
        }
      },
      "2ndBoosterVaccination": {
        "vaccinated":3996240,
        "vaccination": {
          "biontech":3179117,
          "moderna":810881,
          "astraZeneca":660,
          "janssen":4364,
          "novavax":1218,
          "deltaBiontech":10783,
          "deltaModerna":3250,
          "deltaAstraZeneca":2,
          "deltaJanssen":8,
          "deltaNovavax":25
        },
        "delta":14068,
        "quote":0.048,
        "quotes": {
          "total":0.048,
          "A05-A17": {
            "total":0.003,
            "A05-A11":null,
            "A12-A17":0.003
          },
          "A18+": {
            "total":0.059,
            "A18-A59":0.013,
            "A60+":0.147
          }
        }
      },
      "states": {
        "SH": {
          "name":"Schleswig-Holstein",
          "administeredVaccinations":6864557,
          "vaccinated":2351695,
          "vaccination": {
            "biontech":1661525,
            "moderna":189976,
            "astraZeneca":363254,
            "janssen":134850,
            "novavax":2090,
            "deltaBiontech":33,
            "deltaModerna":2,
            "deltaAstraZeneca":0,
            "deltaJanssen":0,
            "deltaNovavax":5
          },
          "delta":40,
          "quote":0.808,
          "quotes": {
            "total":0.808,
            "A05-A17": {
              "total":0.596,
              "A05-A11":0.302,
              "A12-A17":0.924
            },
            "A18+": {
              "total":0.884,
              "A18-A59":0.851,
              "A60+":0.938
            }
          },
          "secondVaccination": {
            "vaccinated":2318092,
            "vaccination": {
              "biontech":1836165,
              "moderna":249723,
              "astraZeneca":156907,
              "janssen":459,
              "novavax":1934,
              "deltaBiontech":95,
              "deltaModerna":9,
              "deltaAstraZeneca":0,
              "deltaJanssen":0,
              "deltaNovavax":23
            },
            "delta":127,
            "quote":0.796,
            "quotes": {
              "total":0.796,
              "A05-A17": {
                "total":0.557,
                "A05-A11":0.289,
                "A12-A17":0.856
              },
              "A18+": {
                "total":0.877,
                "A18-A59":0.848,
                "A60+":0.929
              }
            }
          },
          "boosterVaccination": {
            "vaccinated":2107324,
            "vaccination": {
              "biontech":1227875,
              "moderna":877821,
              "janssen":1394,
              "astraZeneca":125,
              "novavax":109,
              "deltaBiontech":229,
              "deltaModerna":122,
              "deltaAstraZeneca":0,
              "deltaJanssen":0,
              "deltaNovavax":1
            },
            "delta":352,
            "quote":0.724,
            "quotes": {
              "total":0.724,
              "A05-A17": {
                "total":0.436,
                "A05-A11":null,
                "A12-A17":0.436
              },
              "A18+": {
                "total":0.785,
                "A18-A59":0.719,
                "A60+":0.902
              }
            }
          },
          "2ndBoosterVaccination": {
            "vaccinated":160350,
            "vaccination": {
              "biontech":97809,
              "moderna":62514,
              "janssen":null,
              "astraZeneca":null,
              "novavax":27,
              "deltaBiontech":277,
              "deltaModerna":331,
              "deltaAstraZeneca":0,
              "deltaJanssen":0,
              "deltaNovavax":1
            },
            "delta":609,
            "quote":0.055,
            "quotes": {
              "total":0.055,
              "A05-A17": {
                "total":0.002,
                "A05-A11":null,
                "A12-A17":0.002
              },
              "A18+": {
                "total":0.117,
                "A18-A59":0.017,
                "A60+":0.017
              }
            }
          }
        },
        ...
        "Bund": {
          "name":"Bundesressorts",
          "administeredVaccinations":533493,
          "vaccinated":201886,
          "vaccination": {
            "biontech":90037,
            "moderna":83293,
            "astraZeneca":20400,
            "janssen":8126,
            "novavax":30,
            "deltaBiontech":0,
            "deltaModerna":0,
            "deltaAstraZeneca":0,
            "deltaJanssen":0,
            "deltaNovavax":0
          },
          "delta":0,
          "quote":null,
          "quotes": {
            "total":null,
            "A05-A17": {
              "total":null,
              "A05-A11":null,
              "A12-A17":null
            },
            "A18+": {
              "total":null,
              "A18-A59":null,
              "A60+":null
            }
          },
          "secondVaccination": {
            "vaccinated":189399,
            "vaccination": {
              "biontech":92222,
              "moderna":87247,
              "astraZeneca":9910,
              "janssen":18,
              "novavax":2,
              "deltaBiontech":0,
              "deltaModerna":0,
              "deltaAstraZeneca":0,
              "deltaJanssen":0,
              "deltaNovavax":0
            },
            "delta":0,
            "quote":null,
            "quotes": {
              "total":null,
              "A05-A17": {
                "total":null,
                "A05-A11":null,
                "A12-A17":null
              },
              "A18+": {
                "total":null,
                "A18-A59":null,
                "A60+":null
              }
            }
          },
          "boosterVaccination": {
            "vaccinated":141589,
            "vaccination": {
              "biontech":109334,
              "moderna":32246,
              "janssen":5,
              "astraZeneca":3,
              "novavax":1,
              "deltaBiontech":0,
              "deltaModerna":0,
              "deltaAstraZeneca":0,
              "deltaJanssen":0,
              "deltaNovavax":0
            },
            "delta":0,
            "quote":null,
            "quotes": {
              "total":null,
              "A05-A17": {
                "total":null,
                "A05-A11":null,
                "A12-A17":null
              },
              "A18+": {
                "total":null,
                "A18-A59":null,
                "A60+":null
              }
            }
          },
          "2ndBoosterVaccination": {
            "vaccinated":619,
            "vaccination": {
              "biontech":580,
              "moderna":39,
              "janssen":null,
              "astraZeneca":null,
              "novavax":null,
              "deltaBiontech":0,
              "deltaModerna":0,
              "deltaAstraZeneca":0,
              "deltaJanssen":0,
              "deltaNovavax":0
            },
            "delta":0,
            "quote":null,
            "quotes": {
              "total":null,
              "A05-A17": {
                "total":null,
                "A05-A11":null,
                "A12-A17":null
              },
              "A18+": {
                "total":null,
                "A18-A59":null,
                "A60+":null
              }
            }
          }
        }
      }
    },
    "meta": {
      "source":"Robert Koch-Institut",
      "contact":"Marlon Lueckert (m.lueckert@me.com)",
      "info":"https://github.com/marlon360/rki-covid-api",
      "lastUpdate":"2022-05-02T06:53:48.000Z",
      "lastCheckedForUpdate":"2022-05-02T13:10:08.247Z"
    }
  }
}
```

## `/vaccinations/states`

### Request

`GET https://api.corona-zahlen.org/vaccinations/states`
[Open](/vaccinations/states)

### Response

This responses only the states data (but not all of Germany)

```json
{
  "data": {
    "SH": {
      "name":"Schleswig-Holstein",
      "administeredVaccinations":6864694,
      "vaccinated":2351707,
      "vaccination": {
        "biontech":1661535,
        "moderna":189978,
        "astraZeneca":363254,
        "janssen":134850,
        "novavax":2090,
        "deltaBiontech":10,
        "deltaModerna":2,
        "deltaAstraZeneca":0,
        "deltaJanssen":0,
        "deltaNovavax":0
      },
      "delta":12,
      "quote":0.808,
      "quotes": {
        "total":0.808,
        "A05-A17": {
          "total":0.596,
          "A05-A11":0.302,
          "A12-A17":0.924
        },
        "A18+": {
          "total":0.884,
          "A18-A59":0.851,
          "A60+":0.938
        }
      },
      "secondVaccination": {
        "vaccinated":2318116,
        "vaccination": {
          "biontech":1836187,
          "moderna":249725,
          "astraZeneca":156907,
          "janssen":459,
          "novavax":1934,
          "deltaBiontech":22,
          "deltaModerna":2,
          "deltaAstraZeneca":0,
          "deltaJanssen":0,
          "deltaNovavax":0
        },
        "delta":24,
        "quote":0.796,
        "quotes": {
          "total":0.796,
          "A05-A17": {
            "total":0.557,
            "A05-A11":0.289,
            "A12-A17":0.856
          },
          "A18+": {
            "total":0.877,
            "A18-A59":0.848,
            "A60+":0.929
          }
        }
      },
      "boosterVaccination": {
        "vaccinated":2107341,
        "vaccination": {
          "biontech":1227891,
          "moderna":877822,
          "janssen":1394,
          "astraZeneca":125,
          "novavax":109,
          "deltaBiontech":16,
          "deltaModerna":1,
          "deltaAstraZeneca":0,
          "deltaJanssen":0,
          "deltaNovavax":0
        },
        "delta":17,
        "quote":0.724,
        "quotes": {
          "total":0.724,
          "A05-A17": {
            "total":0.436,
            "A05-A11":null,
            "A12-A17":0.436
          },
          "A18+": {
            "total":0.785,
            "A18-A59":0.719,
            "A60+":0.902
          }
        }
      },
      "2ndBoosterVaccination": {
        "vaccinated":160434,
        "vaccination": {
          "biontech":97891,
          "moderna":62516,
          "janssen":null,
          "astraZeneca":null,
          "novavax":27,
          "deltaBiontech":82,
          "deltaModerna":2,
          "deltaAstraZeneca":0,
          "deltaJanssen":0,
          "deltaNovavax":0
        },
        "delta":84,
        "quote":0.055,
        "quotes": {
          "total":0.055,
          "A05-A17": {
            "total":0.002,
            "A05-A11":null,
            "A12-A17":0.002
          },
          "A18+": {
            "total":0.117,
            "A18-A59":0.017,
            "A60+":0.017
          }
        }
      }
    },
    ...
    "TH": {
      "name":"Thüringen",
      "administeredVaccinations":4069642,
      "vaccinated":1499281,
      "vaccination": {
        "biontech":1089480,
        "moderna":140934,
        "astraZeneca":171084,
        "janssen":95192,
        "novavax":2591,
        "deltaBiontech":2,
        "deltaModerna":-10,
        "deltaAstraZeneca":0,
        "deltaJanssen":0,
        "deltaNovavax":3
      },
      "delta":-5,
      "quote":0.707,
      "quotes": {
        "total":0.707,
        "A05-A17": {
          "total":0.301,
          "A05-A11":0.113,
          "A12-A17":0.535
        },
        "A18+": {
          "total":0.795,
          "A18-A59":0.732,
          "A60+":0.878
        }
      },
      "secondVaccination": {
        "vaccinated":1468748,
        "vaccination": {
          "biontech":1174437,
          "moderna":165618,
          "astraZeneca":78447,
          "janssen":347,
          "novavax":1763,
          "deltaBiontech":37,
          "deltaModerna":2,
          "deltaAstraZeneca":0,
          "deltaJanssen":0,
          "deltaNovavax":3
        },
        "delta":42,
        "quote":0.693,
        "quotes": {
          "total":0.693,
          "A05-A17": {
            "total":0.287,
            "A05-A11":0.106,
            "A12-A17":0.512
          },
          "A18+": {
            "total":0.78,
            "A18-A59":0.711,
            "A60+":0.878
          }
        }
      },
      "boosterVaccination": {
        "vaccinated":1101633,
        "vaccination": {
          "biontech":750456,
          "moderna":351001,
          "janssen":118,
          "astraZeneca":4,
          "novavax":54,
          "deltaBiontech":173,
          "deltaModerna":14,
          "deltaAstraZeneca":0,
          "deltaJanssen":0,
          "deltaNovavax":2
        },
        "delta":189,
        "quote":0.52,
        "quotes": {
          "total":0.52,
          "A05-A17": {
            "total":0.192,
            "A05-A11":null,
            "A12-A17":0.192
          },
          "A18+": {
            "total":0.602,
            "A18-A59":0.5,
            "A60+":0.748
          }
        }
      },
      "2ndBoosterVaccination": {
        "vaccinated":48116,
        "vaccination": {
          "biontech":41027,
          "moderna":7065,
          "janssen":5,
          "astraZeneca":null,
          "novavax":19,
          "deltaBiontech":205,
          "deltaModerna":5,
          "deltaAstraZeneca":0,
          "deltaJanssen":0,
          "deltaNovavax":0
        },
        "delta":210,
        "quote":0.023,
        "quotes": {
          "total":0.023,
          "A05-A17": {
            "total":0.001,
            "A05-A11":null,
            "A12-A17":0.001
          },
          "A18+": {
            "total":0.027,
            "A18-A59":0.008,
            "A60+":0.008
          }
        }
      }
    }
  },
  "meta": {
    "source":"Robert Koch-Institut",
    "contact":"Marlon Lueckert (m.lueckert@me.com)",
    "info":"https://github.com/marlon360/rki-covid-api",
    "lastUpdate":"2022-05-03T06:53:52.000Z",
    "lastCheckedForUpdate":"2022-05-03T20:11:08.379Z"
  }
}
```

## `/vaccinations/states/:state`

### Request

`GET https://api.corona-zahlen.org/vaccinations/states/HH`
[Open](/vaccinations/states/HH)

### Response

```json
{
  "data": {
    "HH": {
      "name": "Hamburg",
      "administeredVaccinations": 4328358,
      "vaccinated": 1598944,
      "vaccination": {
        "biontech": 1153350,
        "moderna": 129969,
        "astraZeneca": 199211,
        "janssen": 115180,
        "novavax": 1234,
        "deltaBiontech": 406,
        "deltaModerna": 21,
        "deltaAstraZeneca": 0,
        "deltaJanssen": 0,
        "deltaNovavax": 5
      },
      "delta": 432,
      "quote": 0.863,
      "quotes": {
        "total": 0.863,
        "A05-A17": {
          "total": 0.509,
          "A05-A11": 0.293,
          "A12-A17": 0.78
        },
        "A18+": {
          "total": 0.968,
          "A18-A59": 0.958,
          "A60+": 0.981
        }
      },
      "secondVaccination": {
        "vaccinated": 1549544,
        "vaccination": {
          "biontech": 1248184,
          "moderna": 192503,
          "astraZeneca": 44833,
          "janssen": 511,
          "novavax": 1042,
          "deltaBiontech": 822,
          "deltaModerna": 136,
          "deltaAstraZeneca": 0,
          "deltaJanssen": 0,
          "deltaNovavax": 1
        },
        "delta": 959,
        "quote": 0.836,
        "quotes": {
          "total": 0.836,
          "A05-A17": {
            "total": 0.448,
            "A05-A11": 0.235,
            "A12-A17": 0.715
          },
          "A18+": {
            "total": 0.945,
            "A18-A59": 0.933,
            "A60+": 0.974
          }
        }
      },
      "boosterVaccination": {
        "vaccinated": 1133020,
        "vaccination": {
          "biontech": 687894,
          "moderna": 444613,
          "janssen": 258,
          "astraZeneca": 166,
          "novavax": 89,
          "deltaBiontech": 1746,
          "deltaModerna": 328,
          "deltaAstraZeneca": 0,
          "deltaJanssen": 0,
          "deltaNovavax": 1
        },
        "delta": 2075,
        "quote": 0.612,
        "quotes": {
          "total": 0.612,
          "A05-A17": {
            "total": 0.286,
            "A05-A11": null,
            "A12-A17": 0.286
          },
          "A18+": {
            "total": 0.718,
            "A18-A59": 0.682,
            "A60+": 0.808
          }
        }
      },
      "2ndBoosterVaccination": {
        "vaccinated": 109321,
        "vaccination": {
          "biontech": 79525,
          "moderna": 29711,
          "janssen": 1,
          "astraZeneca": null,
          "novavax": 84,
          "deltaBiontech": 1396,
          "deltaModerna": 179,
          "deltaAstraZeneca": 0,
          "deltaJanssen": 0,
          "deltaNovavax": 0
        },
        "delta": 1575,
        "quote": 0.059,
        "quotes": {
          "total": 0.059,
          "A05-A17": {
            "total": 0.004,
            "A05-A11": null,
            "A12-A17": 0.004
          },
          "A18+": {
            "total": 0.071,
            "A18-A59": 0.019,
            "A60+": 0.019
          }
        }
      }
    }
  },
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2022-05-04T06:54:40.000Z",
    "lastCheckedForUpdate": "2022-05-04T18:20:28.758Z"
  }
}
```

**Parameters**

| Parameter | Description                         |
| --------- | ----------------------------------- |
| :state    | abbreviation of the requested state |

## `/vaccinations/germany`

### Request

`GET https://api.corona-zahlen.org/vaccinations/germany`
[Open](/vaccinations/germany)

### Response

This responses only the germany data

```json
{
  "data": {
    "administeredVaccinations": 178601338,
    "vaccinated": 64500699,
    "vaccination": {
      "biontech": 46310909,
      "moderna": 5108169,
      "astraZeneca": 9336123,
      "janssen": 3686224,
      "novavax": 59274,
      "deltaBiontech": 1385,
      "deltaModerna": 87,
      "deltaAstraZeneca": 22,
      "deltaJanssen": 13,
      "deltaNovavax": 241
    },
    "delta": 1748,
    "quote": 0.776,
    "quotes": {
      "total": 0.776,
      "A05-A17": {
        "total": 0.452,
        "A05-A11": 0.22,
        "A12-A17": 0.722
      },
      "A18+": {
        "total": 0.866,
        "A18-A59": 0.833,
        "A60+": 0.916
      }
    },
    "secondVaccination": {
      "vaccinated": 63014353,
      "vaccination": {
        "biontech": 50808120,
        "moderna": 6342570,
        "astraZeneca": 3533142,
        "janssen": 10811,
        "novavax": 48250,
        "deltaBiontech": 2970,
        "deltaModerna": 292,
        "deltaAstraZeneca": 1,
        "deltaJanssen": 5,
        "deltaNovavax": 311
      },
      "delta": 3579,
      "quote": 0.758,
      "quotes": {
        "total": 0.758,
        "A05-A17": {
          "total": 0.411,
          "A05-A11": 0.193,
          "A12-A17": 0.666
        },
        "A18+": {
          "total": 0.85,
          "A18-A59": 0.819,
          "A60+": 0.908
        }
      }
    },
    "boosterVaccination": {
      "vaccinated": 49329564,
      "vaccination": {
        "biontech": 31185360,
        "moderna": 18117070,
        "astraZeneca": 6175,
        "janssen": 18357,
        "novavax": 2602,
        "deltaBiontech": 9187,
        "deltaModerna": 1474,
        "deltaAstraZeneca": 0,
        "deltaJanssen": 19,
        "deltaNovavax": 26
      },
      "delta": 10706,
      "quote": 0.593,
      "quotes": {
        "total": 0.593,
        "A05-A17": {
          "total": 0.307,
          "A05-A11": null,
          "A12-A17": 0.307
        },
        "A18+": {
          "total": 0.689,
          "A18-A59": 0.631,
          "A60+": 0.797
        }
      }
    },
    "2ndBoosterVaccination": {
      "vaccinated": 4028182,
      "vaccination": {
        "biontech": 3205209,
        "moderna": 816699,
        "astraZeneca": 660,
        "janssen": 4380,
        "novavax": 1234,
        "deltaBiontech": 26092,
        "deltaModerna": 5818,
        "deltaAstraZeneca": 0,
        "deltaJanssen": 16,
        "deltaNovavax": 16
      },
      "delta": 31942,
      "quote": 0.048,
      "quotes": {
        "total": 0.048,
        "A05-A17": {
          "total": 0.003,
          "A05-A11": null,
          "A12-A17": 0.003
        },
        "A18+": {
          "total": 0.06,
          "A18-A59": 0.013,
          "A60+": 0.148
        }
      }
    }
  },
  "meta": {
    "source": "Robert Koch-Institut",
    "contact": "Marlon Lueckert (m.lueckert@me.com)",
    "info": "https://github.com/marlon360/rki-covid-api",
    "lastUpdate": "2022-05-03T06:53:52.000Z",
    "lastCheckedForUpdate": "2022-05-03T20:10:44.459Z"
  }
}
```

## `/vaccinations/history`

### Request

`GET https://api.corona-zahlen.org/vaccinations/history`
[Open](/vaccinations/history)

### Response

`date` the Date of the following values

`vaccinated` for legacy resons, this is the same as `firstVaccination`

`firstVaccination` First vaccinations of the day

`secondVaccination` Second vaccinations of the day

`firstBoosterVacciation` First booster vaccinations of the day

`secondBoosterVaccination` Second booster vaccinations of the day

`totalVaccinationOfTheDay` Total vaccinations of the day

```json
{
  "data": {
    "history": [
      {
        "date":"2020-12-27T00:00:00.000Z",
        "vaccinated":24421,
        "firstVaccination":24421,
        "secondVaccination":null,
        "firstBoosterVaccination":null,
        "secondBoosterVaccination":null,
        "totalVacciantionOfTheDay":24421
      },
      {
        "date":"2020-12-28T00:00:00.000Z",
        "vaccinated":18007,
        "firstVaccination":18007,
        "secondVaccination":null,
        "firstBoosterVaccination":null,
        "secondBoosterVaccination":null,
        "totalVacciantionOfTheDay":18007
      },
      {
        "date":"2020-12-29T00:00:00.000Z",
        "vaccinated":50055,
        "firstVaccination":50055,
        "secondVaccination":null,
        "firstBoosterVaccination":null,
        "secondBoosterVaccination":null,
        "totalVacciantionOfTheDay":50055
      },
      ...
      {
        "date":"2022-05-01T00:00:00.000Z",
        "vaccinated":241,
        "firstVaccination":241,
        "secondVaccination":318,
        "firstBoosterVaccination":991,
        "secondBoosterVaccination":2550,
        "totalVacciantionOfTheDay":4100
      }
    ]
  },
  "meta": {
    "source":"Robert Koch-Institut",
    "contact":"Marlon Lueckert (m.lueckert@me.com)",
    "info":"https://github.com/marlon360/rki-covid-api",
    "lastUpdate":"2022-05-02T06:53:48.000Z",
    "lastCheckedForUpdate":"2022-05-02T15:30:22.447Z"
  }
}
```

## `/vaccinations/history/:days`

### Request

`GET https://api.corona-zahlen.org/vaccinations/history/7`
[Open](/vaccinations/history/7)

**Parameters**

| Parameter | Description                           |
| --------- | ------------------------------------- |
| :days     | Number of days in the past from today |
