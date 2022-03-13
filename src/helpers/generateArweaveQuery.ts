import { IKeys } from '../types'

export default function generateArweaveQuery(keys: IKeys) {
  return `
  query {
      transactions(
          tags: [{
              name: "App-Name",
              values: ["ERS"]
          },{
              name: "Device-Id",
              values: ["${keys.primaryPublicKeyHash}"]
          },{
              name: "Device-Record-Type",
              values: ["Device-Create", "Device-Media"]
          }
      ]
      ) {
          edges {
              cursor
              node {
              id
              tags {
                  name
                  value
              }
              block {
                  id
                  timestamp
                  height
              }
              }
          }
      }
  }
  `
}
