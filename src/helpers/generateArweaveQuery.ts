import { IKeys } from '../types'

// Render only records for chain ID 1; can use to filter for testing.
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
          },{
              name: "Device-Minter-Chain-Id",
              values: ["1"]
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
