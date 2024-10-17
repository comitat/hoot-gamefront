import EventStatus from "#models/event_status";

export const getEventStatusResponse = async (eventStatus: EventStatus, bonusEnergyValue: number) => {

  const response = eventStatus.serialize({
    fields: {
      omit: ['eventId'],
    },
    relations: {
      event: {
        fields: {
          omit: ['id'],
        }
      }
    },
  })

  const ret = {
    ...response,
  }

  // if (bonusEnergyValue) {
    ret.bonusEnergyValue = bonusEnergyValue
  // }

  return ret;
}

export const getEventStatusesResponse = async (eventStatuses: EventStatus[]) => {
  const responses = await Promise.all(eventStatuses.map(async (eventStatus) => {

    const response = eventStatus.serialize({
      fields: {
        omit: ['eventId'],
      },
      relations: {
        event: {
            fields: {
              omit: ['id'],
            }
        }
      },
    })

    return {
      ...response,
    }
  }))

  return responses
}
