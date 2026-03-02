#!/bin/bash

# Define the image mapping
declare -A cards=(
  ["milotic-incandescent-arcana-070-068"]="https://static.tcgcollector.com/content/images/8a/5c/11/8a5c11c1228fa8fd1faa9521f1a325217419aa7d62d9814d67345189620196ca.jpg"
  ["jynx-incandescent-arcana-071-068"]="https://static.tcgcollector.com/content/images/6f/eb/73/6feb738a8bdeb54c384d78cfaabd9555f1e7f5c5f11941aa2b805448433e6e99.jpg"
  ["gardevoir-incandescent-arcana-072-068"]="https://static.tcgcollector.com/content/images/95/b4/c8/95b4c8d662ac394973efae113f88c260f27b1ccc47ba618a9e6717c6fe133f1d.jpg"
  ["smeargle-incandescent-arcana-073-068"]="https://static.tcgcollector.com/content/images/42/5b/48/425b48b7142f661ddfbebe0b1b24d0de494c548b330c446774c35352068d455f.jpg"
  ["altaria-incandescent-arcana-074-068"]="https://static.tcgcollector.com/content/images/62/a6/70/62a6701a3454462a6f595940c1fa5adb8f1439746a25cdabb7d157e3ba45d0dc.jpg"
  ["parasect-dark-phantasma-072-071"]="https://static.tcgcollector.com/content/images/b2/62/82/b26282add7a1ac6d2014c4a6f547ca84fa20a82c3465a461cfbebbf6de0fd1bc.jpg"
  ["pikachu-dark-phantasma-073-071"]="https://static.tcgcollector.com/content/images/27/ce/ec/27ceec2bbfb707b390ad46e2fab3e04768d7e22713e39fc0eb619456344f16ba.jpg"
  ["gengar-dark-phantasma-074-071"]="https://static.tcgcollector.com/content/images/0f/77/d4/0f77d4972ce108e385965de02e882f39895cc08cbef33ee4dead0f2796a76ec5.jpg"
  ["hisuian-arcanine-dark-phantasma-075-071"]="https://static.tcgcollector.com/content/images/46/ce/3a/46ce3a51e84974fe20526e62e8f1bd8e2b323f76d30c9da313250de24e7a2d62.jpg"
  ["spiritomb-dark-phantasma-076-071"]="https://static.tcgcollector.com/content/images/ea/97/fa/ea97fa6423cfb50d9bbafe4c469f49abb7c31c1974110cd6c7002b11f0e8199c.jpg"
  ["snorlax-dark-phantasma-077-071"]="https://static.tcgcollector.com/content/images/fe/c1/41/fec141d23c622e0dc62a889a4a54a1d7f669bc80af22d4a16857ce177945a572.jpg"
)

# Create the directory in your Next.js public folder
mkdir -p public/pokemon-cards

for name in "${!cards[@]}"; do
  echo "Downloading $name..."
  # Using curl with a User-Agent and Referer to prevent being blocked
  curl -o "public/pokemon-cards/${name}.jpg" "${cards[$name]}" \
    -H "Referer: https://www.tcgcollector.com/" \
    -H "User-Agent: Mozilla/5.0"
done

echo "Finished! Images are in public/pokemon-cards/"
