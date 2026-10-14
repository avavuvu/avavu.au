---
title: Finding Melbourne's most useless tram stop
aliases:
  - closest-trams
date: "2025-11-29"
description: The search for the two closest tram stops in a network full of pointless tram stops.
image:
  src: /images/writing/tram/header.webp
  alt: Google Maps screenshot of burke rd
type: writing
layout: longform
categories: [essays]
---

When I travel on the Route 70 toward Glenferrie Road, there's a moment that always trips me up. I cruise past Kooyongkoot Road, and in preparation for my stop I pull the string. The 70 only runs the old style trams with the string, so I make sure to savour it before the old trams get phased out. 

But as I am mid string-pull-savour, I'm snapped back into reality. An announcement comes over the loud speaker: "Now arriving at **Berkeley Street**". I've just requested one stop early! And now I'm going to be late to get frozen yoghurt on Glenferrie Road.

Remarkably, the distance between Berkeley Street and Kooyongkoot Road is just 116 metres. This is a tiny distance, better travelled on foot than by tram. With both stops serving the same chunk of unassuming Inner East suburbia, this very well could be the most useless tram stop in Melbourne. But is it? How can we find out? Per-stop ridership data is not available, so to figure out the most useless stop let's go with a helpful proxy: **which two Melbourne tram stops are closest together?**

This is a gripping question that has been eating away at me for a few months now. But then one day, I woke up and remembered I know how to code. Thinking about the problem, it really didn't seem that hard. And it wasn't. I finished most of the work in an afternoon. 

Here's the top three:

<Wide>

<table><thead><tr><th>Rank</th><th>Name</th><th>Distance</th><th>Link</th></tr></thead><tbody><tr><td class="rank">1. </td><td><strong>Miller Street</strong> to <strong>St Georges Road</strong></td><td>62.50m</td><td><a href="https://www.google.com/maps?q=-37.7522782,144.994889">Google Maps</a></td></tr><tr><td colspan="4"><img src="/images/writing/tram/miller-street-to-st-georges-road.jpg" loading="lazy" class="street-view-image"> </td></tr><tr><td class="rank">2. </td><td><strong>Hawthorn Road</strong> to <strong>Dandenong Road</strong></td><td>72.09m</td><td><a href="https://www.google.com/maps?q=-37.8658912,145.0267879">Google Maps</a></td></tr><tr><td colspan="4"><img src="/images/writing/tram/hawthorn-road-to-dandenong-road.jpg" loading="lazy" class="street-view-image"> </td></tr><tr><td class="rank">3. </td><td><strong>Caulfield Station</strong> to <strong>Dandenong Road</strong></td><td>77.49m</td><td><a href="https://www.google.com/maps?q=-37.8763788,145.0417745">Google Maps</a></td></tr><tr><td colspan="4"><img src="/images/writing/tram/caulfield-station-to-dandenong-road.jpg" loading="lazy" class="street-view-image"> </td></tr></tbody></table>

</Wide>

And the answer is **Miller Street** to **St Georges Road**! At just 62 metres, you could likely get off at Miller Street, run to St Georges Road, and get on the same tram. Or at least you could, if it wasn't for the large intersection requiring prospective passengers to wait at the pedestrian crossing. Closeness is not quite the same thing as usefulness. This stop allows passengers to skip waiting for the light to turn green. It's not super important, but removing it would make someone's life slightly worse. 

That's also true for **Hawthorn Road** to **Dandenong Road**, also positioned on a T-intersection. These stops are arguably useful, and are arguably less close than my code would make it seem as I only took distances *as the crow flies*, meaning a straight line. Because these stops are positioned at either side of an intersection, actual passengers would be required to walk further. [You can watch YouTuber Qazzy ride this journey in real time.](https://youtu.be/noRifpT9zHY?si=8ibJltXWQiPHr4KU&t=138)

The first truly useless stop is at number 3: **Caulfield Station** to **Dandenong Road**. This stop connects Caulfield Station to nothing, and was my prediction for the closest two tram stops. At 77 metres, this stop really has no reason to exist. For some context, the network average is 285 metres.<Sidenote>Pulled from *[Distributions of walking access to public transport in Melbourne, Australia – Evidence on acceptable and tolerable walking distances](https://www.tandfonline.com/doi/full/10.1080/15568318.2024.2385641#d1e1319)*</Sidenote> [You can walk the distance in 30 seconds.](https://youtu.be/lL-J0czl3_g?si=H-HWsrbNq9Ls1TFO&t=77) 

Apparently, [there used to be more of these useless stops around the network](https://railgallery.wongm.com/melbourne-tram-stop-closures/), but the government has been slowly cleaning them up as they make way for low floor trams. It would be an interesting sub-question to find the shortest distance between tram stops to *ever* exist on the network. That can be homework for someone else. 

<blockquote><p class="pull-quote">So there it is, <strong>Caulfield Station</strong> to <strong>Dandenong Road</strong> is my pick for the most useless tram stop. </p></blockquote>

### Bottom 15

Here's the full bottom 15. **Berkeley Street** to **Kooyongkoot Road**, my local stops that started me on this quest, ranks 12. 

<Wide>

<table><thead><tr><th>Rank</th><th>Name</th><th>Distance</th><th>Link</th></tr></thead><tbody><tr><td class="rank">1. </td><td><strong>Miller Street</strong> to <strong>St Georges Road</strong></td><td>62.50m</td><td><a href="https://www.google.com/maps?q=-37.7522782,144.994889">Google Maps</a></td></tr><tr><td colspan="4"><img src="/images/writing/tram/miller-street-to-st-georges-road.jpg" loading="lazy" class="street-view-image"> </td></tr><tr><td class="rank">2. </td><td><strong>Hawthorn Road</strong> to <strong>Dandenong Road</strong></td><td>72.09m</td><td><a href="https://www.google.com/maps?q=-37.8658912,145.0267879">Google Maps</a></td></tr><tr><td colspan="4"><img src="/images/writing/tram/hawthorn-road-to-dandenong-road.jpg" loading="lazy" class="street-view-image"> </td></tr><tr><td class="rank">3. </td><td><strong>Caulfield Station</strong> to <strong>Dandenong Road</strong></td><td>77.49m</td><td><a href="https://www.google.com/maps?q=-37.8763788,145.0417745">Google Maps</a></td></tr><tr><td colspan="4"><img src="/images/writing/tram/caulfield-station-to-dandenong-road.jpg" loading="lazy" class="street-view-image"> </td></tr><tr><td class="rank">4. </td><td><strong>McNamara Street</strong> to <strong>Regent Street</strong></td><td>91.44m</td><td><a href="https://www.google.com/maps?q=-37.7300439,144.9914079">Google Maps</a></td></tr><tr><td colspan="4"><img src="/images/writing/tram/mcnamara-street-to-regent-street.jpg" loading="lazy" class="street-view-image"> </td></tr><tr><td class="rank">5. </td><td><strong>Camberwell Junction</strong> to <strong>Camberwell Market</strong></td><td>96.09m</td><td><a href="https://www.google.com/maps?q=-37.8313239,145.0564329">Google Maps</a></td></tr><tr><td colspan="4"><img src="/images/writing/tram/camberwell-junction-to-camberwell-market.jpg" loading="lazy" class="street-view-image"> </td></tr><tr><td class="rank">6. </td><td><strong>Brighton Road</strong> to <strong>St Kilda Town Hall</strong></td><td>99.92m</td><td><a href="https://www.google.com/maps?q=-37.8680403,144.9877154">Google Maps</a></td></tr><tr><td colspan="4"><img src="/images/writing/tram/brighton-road-to-st-kilda-town-hall.jpg" loading="lazy" class="street-view-image"> </td></tr><tr><td class="rank">7. </td><td><strong>Kew Shopping Centre</strong> to <strong>High Street</strong></td><td>101.05m</td><td><a href="https://www.google.com/maps?q=-37.8069028,145.030464">Google Maps</a></td></tr><tr><td colspan="4"><img src="/images/writing/tram/kew-shopping-centre-to-high-street.jpg" loading="lazy" class="street-view-image"> </td></tr><tr><td class="rank">8. </td><td><strong>St Kilda Station</strong> to <strong>Canterbury Road</strong></td><td>103.78m</td><td><a href="https://www.google.com/maps?q=-37.8590039,144.9772792">Google Maps</a></td></tr><tr><td colspan="4"><img src="/images/writing/tram/st-kilda-station-to-canterbury-road.jpg" loading="lazy" class="street-view-image"> </td></tr><tr><td class="rank">9. </td><td><strong>Kooyong Tennis Centre</strong> to <strong>Kooyong Station</strong></td><td>110.22m</td><td><a href="https://www.google.com/maps?q=-37.8383462,145.0325333">Google Maps</a></td></tr><tr><td colspan="4"><img src="/images/writing/tram/kooyong-tennis-centre-to-kooyong-station.jpg" loading="lazy" class="street-view-image"> </td></tr><tr><td class="rank">10. </td><td><strong>North Melbourne Town Hall</strong> to <strong>Curzon Street</strong></td><td>111.86m</td><td><a href="https://www.google.com/maps?q=-37.8032545,144.9495557">Google Maps</a></td></tr><tr><td colspan="4"><img src="/images/writing/tram/north-melbourne-town-hall-to-curzon-street.jpg" loading="lazy" class="street-view-image"> </td></tr><tr><td class="rank">11. </td><td><strong>Glenhuntly Shops</strong> to <strong>Glen Huntly Station</strong></td><td>115.24m</td><td><a href="https://www.google.com/maps?q=-37.8892595,145.0407593">Google Maps</a></td></tr><tr><td colspan="4"><img src="/images/writing/tram/glenhuntly-shops-to-glen-huntly-station.jpg" loading="lazy" class="street-view-image"> </td></tr><tr><td class="rank">12. </td><td><strong>Berkeley Street</strong> to <strong>Kooyongkoot Road</strong></td><td>116.44m</td><td><a href="https://www.google.com/maps?q=-37.8291113,145.0373164">Google Maps</a></td></tr><tr><td colspan="4"><img src="/images/writing/tram/berkeley-street-to-kooyongkoot-road.jpg" loading="lazy" class="street-view-image"> </td></tr><tr><td class="rank">13. </td><td><strong>Malvern Station</strong> to <strong>Hawthorn Road</strong></td><td>117.66m</td><td><a href="https://www.google.com/maps?q=-37.8652468,145.0278511">Google Maps</a></td></tr><tr><td colspan="4"><img src="/images/writing/tram/malvern-station-to-hawthorn-road.jpg" loading="lazy" class="street-view-image"> </td></tr><tr><td class="rank">14. </td><td><strong>Footscray Market</strong> to <strong>Footscray Station</strong></td><td>120.17m</td><td><a href="https://www.google.com/maps?q=-37.8001007,144.9011424">Google Maps</a></td></tr><tr><td colspan="4"><img src="/images/writing/tram/footscray-market-to-footscray-station.jpg" loading="lazy" class="street-view-image"> </td></tr><tr><td class="rank">15. </td><td><strong>Footscray Market</strong> to <strong>Nicholson Street</strong></td><td>122.80m</td><td><a href="https://www.google.com/maps?q=-37.8001007,144.9011424">Google Maps</a></td></tr><tr><td colspan="4"><img src="/images/writing/tram/footscray-market-to-nicholson-street.jpg" loading="lazy" class="street-view-image"> </td></tr></tbody></table>

</Wide>

## Technical
If you're a nerd, you're probably wondering how I made this. This project was partly inspired by me learning about the closest pairs problem, a common textbook problem for teaching algorithmic complexity. *How do you find the closest pair of points in a list of points?* The naïve solution is just comparing every point to every other point, which means doing `(Number of points)²` calculations. 

Melbourne has around 1700 tram stops, which means `1700²`, which is `2,890,000` calculations. There is a canonical improvement to the closest pair problem that splits up the points into smaller sections. That solves the problem in `(Number of points) * log(Number of points)` which is (roughly) `18,200` comparisons. 

Two million is a large number, and I was worried about how long it would take, but my burning desire to know which two tram stops are the closest together was too strong, and I decided to just implement the naïve solution and wait out however long it would take. But here's the thing—the code finished instantly. Two million operations – while two orders of magnitude larger than 18,200 – is tiny for a computer. 

The answer returned by my code revealed another issue. The answer returned was two stops on the Chapel Street-Commercial Road intersection. This seemed strange to me, and after writing a quick script to visualise them I realised the issue. My code was matching stops on different tram routes. Obviously, tram stops on different routes are close together, that's the whole point of an intersection. 

![screenshot of Chapel Street map](/images/writing/tram/intersection-fail.webp)

The data I was using was a big list from the Victorian Government, but it didn't list the route associated with each stop. But it did list the stop number, i.e. Melbourne University, *Stop #1*. My solution then was a slightly ugly one. I checked that every stop's number was only one more or one less than the stop it was being compared to. This worked! Kind of. 

![screenshot of Camberwell Junction map](/images/writing/tram/split-fail.webp)

I was still getting back edge cases of stops that happened to have the same number, but were on different routes. This was usually cases like Camberwell Junction, where the 70 and 75 split off, continuing to increase their stop numbers in different directions. My solution was to write some code to help me manually go through and verify these were accurate.

<Wide>

![](/images/writing/tram/tui.webp)

</Wide>

After that I got my answer: Caulfield Station to Derby Road. Astute readers might notice that this is different to the answer listed above. At the time, I was really unsatisfied with that answer, because I couldn't with any confidence know that this was *the* closest stop. My code was just too ugly and unspecific. Looking closer at my data, I realised I was matching tram stops that were on different sides of the road as well. 

### Version 2.0

I decided to scrap this and start again with different data. When I was making my game *[[suburble|Suburble]]*, I used data from OpenStreetMap (OSM) for the tram line data. If you don't know OSM, you should, they are great. It's basically Wikipedia for Google Maps, with every detail and map feature being crowdsourced by the general public. Thanks to volunteers and neurodivergence, this data is very detailed and very accurate. They also have a [scripting language](https://overpass-turbo.eu/) that lets you extract their data into JSON. It's a very weird language that I don't really understand, but I'm usually able to stumble my way through it for simple queries like this.

```
[out:json];

relation["network"="PTV - Metropolitan Trams"]["type"="route"]["route"="tram"]({{bbox}})->.routes;

.routes out;

.routes >;

node._["railway"="tram_stop"];
out;
```

The data on OSM was much more detailed. It didn't take me that long before I had my code churning through it, and it popped out an answer I was much more satisfied with.

If you'd like to play around with my code, it's available on my [GitHub](https://github.com/avavuvu/most-useless-tram-stop). I did the data processing with Pandas, and the actual closest point problem with [[rust|Rust]]. Why Rust and not Python? Because I felt like it, and I want to get better at Rust. That should probably give you some insight into the quality of the code. I also made a little TUI with *Ratatui*, to better help me visualise the data.

Thanks for reading! These kinds of multi-language problem solving projects are always very fun.
