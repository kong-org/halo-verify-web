import { marked } from 'marked'

const test = `| Name               | Value                                                        |
|-----------------------|-------------------------------------------------------------------------------|
| Arisan                | Turtle Rock Vineyards           
| Critic Quote          |  Don Burn's is unquestionably one of California's new superstars- Jeb Dunnuck |
| Wine                  | Westberg Red                                                                  |
| Vintage               | 2019                                                                          |
| Score                 | 98                                                                            |
| Artisan Tasting Notes | Layered with leather, dark cocoa and warm spice                               |
| Size                  | Magnum (1.5L)                                                                 |
| Producer              | Turtle Rock                                                                   |
| Region                | Paso Robles                                                                   |
| Varietal              | Rhone Blend                                                                   |
| Zinfandel             | 42%                                                                           |
| Tempranillo           | 32%                                                                           |
| Petite Syrah          | 26%                                                                           |
| AVA                   | Willow's Creek District                                                       |
| Vineyard              | 4 Hearts                                                                      |
| Elevage               | Aged 22 mos in 50% new French oak                                             |

| Rarity Stats      |                   |
|-------------------|-------------------|
| Bottle Rarity     | 1 of 150          |
| NFT Rarity        | 1 of 3            |
| NFT Bottle Color  | Gold              |
| Storage Location  | Rare Liquid Vault |
| Owner             | PapiV.ETH         |`

export default function formatDescription(txt) {
  return marked(txt)
}
