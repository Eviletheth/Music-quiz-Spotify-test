/* Musikk Quiz vol.2 - shared clue data and cross-window state sync.
   Loaded by both "Musikk quiz board.html" (audience) and
   "Musikk quiz host console.html" (host). */

const QUIZ_DEFAULT_TITLE = 'Musikk Quiz';

/* A board is five categories wide and five difficulties deep. */
const QUIZ_BOARD_ROWS = 5;
const QUIZ_BOARD_COLUMNS = 5;
const QUIZ_BONUS_COUNT = 6;
const QUIZ_SESSION_BOARDS = 3;

/* Trailing tokens on a list line: "@45" clip start, "#3" or "#1/3" tier, "+Framo" codeword. */
const QUIZ_LINE_TOKEN = /\s(?:@\s*(\d+(?:\.\d+)?)|#\s*([1-5](?:\s*\/\s*[1-5])?)|\+([A-Za-z0-9_-]+))$/;

/* The built-in song pool. Same text format as "quiz list.txt" next to these
   pages - that file is the one to edit when the quiz grows; this copy is what
   the pages fall back to when no folder has been chosen. */
const QUIZ_DEFAULT_POOL_TEXT = `
Title: Musikk Quiz

Food:
Eminem - Lose Yourself = Spaghetti #1
Vinskvetten - No e da helg = Brelett #2
Ed Sheeran - Don't = Pizza #3
Postgirobygget - En Solskinnsdag = Krabber #3 +Fram1 +fun4
Shaggy feat. Rikrok - It Wasn't Me = Honey #3 +fun1
Broiler - Powerbeat = Reke #4
Bruno Mars - That's What I Like = Lobster tail, scampi, strawberry #4 +fun3
Flow Kingz feat. Lyng - Kygo jo = Kransekaka #4 +Sesjon1 +Fram1 +fun3
ZZ Top - Burger Man = Burger #4
Michael Jackson - They Don't Care About Us = Dog food #5
Gorillaz - Feel Good Inc = Chocolate #5
Maroon 5 - Sugar = Sugar #2 +Scotland2 +fun3
Men at Work - Down Under = Vegemite sandwich #4 +Scotland2 +fun5
OutKast - Ms. Jackson = pie, Fried fish #5 +fun2
Olivia Rodrigo - good 4 u = Salt #5 +Scotland2 +Fram3 +fun4
Steve Miller Band - The Joker = Peaches #3 +fun5
Flo Rida - Low = Apple, Birthday cake #2 +Fram3 +fun4
Katy Perry - I Kissed a Girl = Cherry #3 +Fram3 +fun4
Def Leppard - Pour Some Sugar on Me = Sugar #1 +Fram3 +fun4
Gwen Stefani - Hollaback Girl = Bananas #3 +fun3
Black Eyed Peas - My Humps = Coco puff #5 +Fram1 +fun5
Eminem, Nate Dogg - Shake That = Apple #4 +fun4
House of Pain - Jump Around = Donuts #5 +fun3
Teriyaki Boyz - Tokyo Drift (Fast & Furious) = Teriyaki #5 +fun4

Country:
Shakira, Burna Boy - Dai Dai = Brazil, Argentina, Colombia, Uruguay, US, England, Germany, France, South Africa, Spain, Mexico, Japan, South Korea, Netherlands #1
Childish Gambino - This Is America = America #2
Billy Joel - We Didn't Start the Fire = China, Korea, England, Lebanon, Congo, Arabia, Iran, Afghanistan, Palestine, [Disneyland] #3
The White Stripes - Seven Nation Army = England #3
Red Hot Chili Peppers - Californication = China, Sweden #3 +fun3
The Lumineers - Ho Hey = China #4
Shakira - Hips Don't Lie = Colombia, Haiti #4 +Scotland1 +Fram2 +fun4
Future - Showed Up = Norway #5
Rascal Flatts - Life Is a Highway = Mozambique #5
R.E.M. - Man on the Moon = Egypt #5 +fun3
Boney M. - Rasputin = Russia #2 +Scotland1 +Fram2 +fun4
Miley Cyrus - Party in the U.S.A. = U.S.A #1 +fun3
Bruce Springsteen - Born in the U.S.A. = U.S.A #1 +fun3
Matthew Wilder - Break My Stride = China #4 +fun3
Ylvis - Jan Egeland = Uganda, Congo #5 +Fram2 +fun4
Eminem - When I'm Gone = Sweden #4 +fun5
DDE - Vinsjan på kaia = Kina #4 +fun5
Jennifer Lopez - On the Floor = Brazil, Morocco #3 +fun4
Teriyaki Boyz - Tokyo Drift (Fast & Furious) = Japan, China #2

Colour:
Thea S - Blinke Blinke Stjernelill = Blå #1
The Rolling Stones - Paint It, Black = Red, -black, green, blue #1 +Test +Scotland1 +Fram1 +fun3
Louis Armstrong - What a Wonderful World = (Green), red, blue, white #1
Lynyrd Skynyrd - Sweet Home Alabama = Blue #1 +Fram4 +fun4
The Police - Roxanne = Red #2
John Denver - Take Me Home, Country Roads = Blue #2
Elton John - Your Song = Green / Blue #3
Travis - Why Does It Always Rain on Me? = Blue #3
Nik Kershaw - Wouldn't It Be Good = Green #3 +fun3
Muse - Uprising = Green, red #3 +Test +fun3
Ed Sheeran - Thinking Out Loud = Green #3 +fun2
Shaggy feat. Rikrok - It Wasn't Me = red #3 +Fram4 +Scotland3 +fun5
Postgirobygget - Idyll = rød #2 +Fram1 +fun4
Soundgarden - Black Hole Sun = Black #3 +fun3
Guns N' Roses - Sweet Child O' Mine = Blue #3 +fun4
Swedish House Mafia, John Martin - Don't You Worry child = Blue #3 +fun3
Lana Del Rey - Summertime Sadness = Red #3 +fun3
Inner Circle - Sweat (A La La La La Long) = Brown #3 +Scotland4 +Fram3 +fun4
Calvin Harris - Summer = brown, blue #3 +fun3
Ed Sheeran, Camila Cabello & Cardi B - South of the Border = Brown,Green #4
George Ezra - Shotgun = Yellow, green #4 +Sesjon1 +Fram4 +fun4
Bruno Mars - That's What I Like = Gold, white #4 +fun3
Nomy - Cocaine = White #4
Rusted Root - Send Me on My Way = Golden #4 +Test +Scotland3 +fun4
David Guetta feat. Sia - Titanium = Titanium #4 +Fram3 +fun4
Red Hot Chili Peppers - Californication = Silver #4 +fun3
Postgirobygget - En Solskinnsdag = hvit, røde #4 +fun4
Smash Mouth - All Star = Gold #4 +Scotland4 +fun4
Rupert Holmes - Escape (The Piña Colada Song) = red #4 +fun4
David Guetta feat. Sia - She Wolf (Falling to Pieces) = Yellow #4 +fun4
Eminem - Brainless = Orange / Red #5
Ed Sheeran - I See Fire = Auburn #5
Coldplay - Viva La Vida = Silver #5 +Test +Scotland1 +Sesjon3 +Fram3 +fun4
Elvis Presley - Jailhouse Rock = purple #5 +fun3
Dolly Parton - Jolene = Auburn, Ivory, emerald green #5 +Fram1 +Scotland3 +fun5
AC/DC - Back in Black = Black #1 +fun4
Prince & The Revolution - Purple Rain = Purple #1 +Scotland3 +fun3
Aqua - Barbie Girl = Pink #2 +fun3
Van Morrison - Brown Eyed Girl = Brown #2 +Fram4 +Scotland3 +fun4
Led Zeppelin - Stairway to Heaven = White, Gold #3 +fun4
HUNTR/X - Golden = Golden #3 +fun3
Guns N' Roses - Paradise City = Green #3 +fun4
Billy Joel - Uptown Girl = White #3 +fun4
Pink Floyd - Wish You Were Here = Blue, Green #3 +fun5
Miley Cyrus - Flowers = red, Gold #4 +fun3
Earth, Wind & Fire - September = golden, blue #4 +fun3
Eagles - Hotel California = Pink #5 +fun5
Bruce Springsteen - Born in the U.S.A. = Yellow #5 +Fram4 +Scotland4 +fun4
The Rolling Stones - Start Me Up = Green #5 +fun3
Culture Club - Karma Chameleon = Red, Gold, Green #3 +Fram1 +fun4
Ricky Martin - Livin' la Vida Loca = Red #3 +fun4
Daniel Powter - Bad Day = Blue, Gray #2 +fun3
Red Hot Chili Peppers - Snow (Hey Oh) = White #4 +fun3
The Clash - Should I stay or should I go = Black #4 +Fram1 +fun4
My Chemical Romance - Welcome to the Black Parade = Black #2 +fun4

Bodypart:
Dean Martin - That's Amore = Eye, feet, heart #1
Artemas - I Like the Way You Kiss Me = Lips, knees #1
Alice Cooper - Poison = Lips, blood, veins, mouth, skin #1
Kylie Minogue - Can't Get You Out of My Head = Head, arms, heart #1 +Fram4 +fun4
Shakira - Hips Don't Lie = Hips #1 +fun4
Dropkick Murphys - I'm Shipping Up to Boston = Leg #2
Eminem - Mockingbird = Lip, eyes, bum, head, heart #2 +Test +fun4
Frank Sinatra - Saturday Night (Is The Loneliest Night In The Week) = Cheek #2
Camila Cabello - Havana = Heart #2 +fun2
Rusted Root - Send Me on My Way = Hand #2
Metallica - Nothing Else Matters = Heart #2 +fun3
George Michael - Careless Whisper = eyes/heart #2 +fun2
Elvis Presley - Can't Help Falling in Love = Hand #2 +fun4
Rupert Holmes - Escape (The Piña Colada Song) = Brain #2 +Scotland4 +fun5
Leonard Cohen - Hallelujah = Hair, lips, tongue #3
The Beatles - Come Together = Hair, knees, feet #3
The Rolling Stones - Paint It, Black = Face, head #3
Sabrina Carpenter - Espresso = Skin, finger #3 +fun3
Camila Cabello & Shawn Mendes - Señorita = Lips, tongue #3 +Test +fun4
Foster the People - Pumped Up Kicks = Mouth, hand, hair #3 +Sesjon3 +Fram3 +fun4
Kygo & Selena Gomez - It Ain't Me = Eye #3 +fun3
Creedence Clearwater Revival - Fortunate Son = Hand #3 +fun4
Dolly Parton - Jolene = hair, skin, eyes #3 +fun3
Stealers Wheel - Stuck in the Middle with You = Back #3 +fun3
Avicii - Waiting for Love = arms #3 +fun3
Amy MacDonald - This Is the Life = hair, head #3 +fun4
Imagine Dragons - Radioactive = Brow, Bones #3 +Scotland2 +fun4
Jimmy Eat World - The Middle = Heart, Head #4
ABBA - The Winner Takes It All = Arms, hand #4
Blur - Song 2 = Head #4 +fun4
Queen - Somebody to Love = Feet, bones #4
David Guetta feat. Sia - Titanium = Bones #4 +fun4
Donny Osmond, Shang - I'll Make a Man Out of You = Spine #4 +Scotland2 +Sesjon1 +fun5
The Clash - Should I stay or should I go = Back #4 +fun3
The Rolling Stones - Angie = Eyes, ear #4 +fun4
Men Without Hats - The Safety Dance = Feet #4 +fun4
MGMT - Kids = Knees #5
Metallica - Master of Puppets = Veins #5 +fun3
Jet - Are You Gonna Be My Girl = Hair, hand #5
Queen & David Bowie - Under Pressure = Brains #5 +Sesjon3 +fun3
CeeLo Green - Fuck You = Ass, chest #5
Muse - Uprising = Eye #5 +fun3
Bonnie Tyler - Holding Out for a Hero = Blood, Feet #5 +Fram4 +Scotland4 +fun5
Afroman - Because I Got High = Pussy #5 +Fram3 +fun4
Aqua - Barbie Girl = Hair, Knees #1 +Scotland4 +fun4
Celine Dion - My Heart Will Go On = Heart #1 +fun3
Britney Spears - Toxic = Lips #2 +Scotland1 +fun5
Neil Diamond - Sweet Caroline = Hands, Shoulders #2 +Fram4 +fun4
The Beatles - I Want to Hold Your Hand = Hand #2 +fun4
Coldplay - Paradise = Eyes, Teeth #2 +fun4
Boney M. - Rasputin = Head, Eyes, arms #3 +fun4
Guns N' Roses - Welcome to the Jungle = Knees #3 +Fram4 +Scotland4 +fun5
Miley Cyrus - Flowers = Hand #3 +fun3
Queen - We Are the Champions = Face #3 +fun4
Coldplay - Yellow = Skin, Bones #3 +Scotland1 +fun4
Aerosmith - Dream On = Face #3 +fun3
Carly Rae Jepsen - Call Me Maybe = Skin #4 +fun3
Men at Work - Down Under = Muscle, Jaw #4 +Fram4 +fun5
The Mamas & The Papas - California Dreamin' = Knees #5 +Fram1 +fun4
Bruce Springsteen - I'm on Fire = Head, Skull #5 +Scotland2 +fun4
Lil Nas X & Billy Ray Cyrus - Old Town Road = Bladder, booty, boobies #5 +fun5
The Rolling Stones - Start Me Up = Hands, Eyes #4 +fun3
Ace of Base - The Sign = Eyes #3 +fun4
Elton John - Candle in the Wind = Brain #4 +Fram1 +fun5
Evanescence - Bring Me to Life = eyes, blood #3 +fun3
Miles Teller, Goose - Great Balls of Fire = Brain, Nails, Thumbs #4 +fun4
Red Hot Chili Peppers - Otherside = throat, Guts #3 +fun4
Kings of Leon - Sex on Fire = Knuckles, Bones, Lips #4 +fun4
Linkin Park - Crawling = Skin #3 +Fram1 +fun5
Caesars - Jerk It Out = Mouth, Head, Bones #4 +fun3
Slipknot - Duality = Fingers, Eyes, Skin, Bones #4 +fun4
Limp Bizkit - Behind Blue Eyes = Eyes #1 +fun3
Black Sabbath - Paranoid = Brain #4 +fun3
Tenacious D - Fuck Her Gently = Teeth #4 +fun5
Black Eyed Peas - My Humps = Ass, Breast, Hand #3 +fun3

Animal:
The Tokens - The Lion Sleeps Tonight = Lion #1
Survivor - Eye of the Tiger = Tiger #1
Lynyrd Skynyrd - Free Bird = Bird #1 +Fram2 +Scotland3 +fun3
DJ MøMø, Kjartan Lauritzen - Badebussen = Høne, mus, løve, pus, elefant, hest #2
Queen - Don't Stop Me Now = Tiger #2
Killswitch Engage - Holy Diver = Tiger, cat #3
Gorillaz - Feel Good Inc = Camel, cats, ponies #3 +Scotland2 +Fram4 +fun4
Nirvana - Smells Like Teen Spirit = Mosquito #3
Elvis Presley - Hound Dog = Dog, hound, rabbit #3 +Scotland3 +fun5
David Guetta feat. Sia - She Wolf (Falling to Pieces) = Wolf, deer #3 +fun3
Thea S - Bjelleklang = Fugl #4
Eminem - Without Me = Fish #4 +Scotland1 +fun4
Alphaville - Forever Young = Horse #4 +fun3
Eminem - Mockingbird = -Mockingbird, piggy #1/4 +Scotland2 +Sesjon3 +Fram3 +fun5
Jonas Blue - Perfect Strangers = Human #4 +fun3
Sia - Chandelier = Bird #4
Toto - Africa = Wild dogs #4 +fun4
Dean Martin - That's Amore = Tarantella #5
Taylor Swift - The Fate of Ophelia = Scorpions #5 +fun2
Muse - Uprising = Cat #5
Lordi - Hard Rock Hallelujah = Lambs #5
The Black Keys - Howlin' for You = Mockingbird #5 +fun3
Owl City - Fireflies = Fireflies, Sheep #1 +Scotland4 +fun3
Billie Eilish - Birds of a Feather = Birds #2 +Fram4 +Scotland2 +fun3
Lil Nas X & Billy Ray Cyrus - Old Town Road = Horse #2 +Scotland3 +fun3
Boney M. - Rasputin = Cat #3 +fun3
Miley Cyrus - Party in the U.S.A. = Butterflies #3 +fun4
The White Stripes - Seven Nation Army = Hounds #4 +fun5
Coldplay - Paradise = Butterfly #4 +Scotland4 +fun5
Bon Jovi - Wanted Dead or Alive = Horse #4 +fun4
Stig Brenner - Lianer = Tiger, slanger, mennesker #4 +Fram4 +fun4
Pink Floyd - Wish You Were Here = Fish #4 +Scotland3 +Fram2 +fun5
Led Zeppelin - Stairway to Heaven = songbird #5 +Scotland3 +Fram3 +fun4
AC/DC - Back in Black = Cat #5 +fun4
Irving Berlin - Anything You Can Do = Sparrow, Partridge #5 +fun3
Culture Club - Karma Chameleon = Chameleon #1 +fun5
Cutting Crew - (I Just) Died in Your Arms = Cat #3 +fun4
Iron Maiden - The Trooper = Horse #4 +fun3
Foo Fighters - Monkey Wrench = Monkey #4 +fun3
Tom Petty - Free Fallin' = Horses #4 +fun3
Florence + the Machine - Dog Days Are Over = Dog, Horses #4 +fun4

City:
Journey - Don't Stop Believin' = Detroit #1
Dropkick Murphys - I'm Shipping Up to Boston = Boston #1 +fun4
Plain White T's - Hey There Delilah = New York #1 +Scotland2 +fun4
Camila Cabello - Havana = -Havana, Atlanta #1/2
Scorpions - Wind of Change = Moskva #2 +Scotland2 +fun4
Train - Drive By = L.A., New York, Santa Fe #2 +Sesjon3 +fun4
Camila Cabello & Shawn Mendes - Señorita = Miami #3 +Scotland2 +fun4
Coldplay - Viva La Vida = Jerusalem #3
The Rolling Stones - Brown Sugar = New Orleans #4 +Scotland2 +fun4
Clean Bandit, Jess Glynne - Rather Be = Kyoto #4
Bee Gees - Stayin' Alive = New York #4 +fun4
The Rolling Stones - Sympathy for the Devil = St. Petersburg, Bombay #5 +Scotland2 +Fram2 +fun4
Bruno Mars - That's What I Like = Manhattan, Miami, Paris #5
Eminem - Mockingbird = Novara #5 +fun4
Rascal Flatts - Life Is a Highway = Memphis, Vancouver #5 +fun3
Alan Walker - Faded = Atlantis #5 +fun3
Lynyrd Skynyrd - Sweet Home Alabama = Birmingham #5 +Scotland3 +fun4
Boney M. - Rasputin = Moscow #2 +fun4
Iggy Azalea feat. Charli XCX - Fancy = L.A, Tokyo #3 +fun3
The Mamas & The Papas - California Dreamin' = LA #3 +Scotland3 +fun4
Men at Work - Down Under = Brussels, Bombay #3 +fun5
Miley Cyrus - Party in the U.S.A. = L.A, Nashville #4 +fun4
Barry Manilow - Copacabana = Havana #4 +Scotland3 +Fram2 +fun4
Ricky Martin - Livin' la Vida Loca = New York #3 +Fram2 +fun5
Kim Carnes - Bette Davis Eyes = New York #5 +fun3
The Animals - The House of the Rising Sun = New Orleans #2 +fun4
DDE - Vinsjan på kaia = Bergen, Murmansk, Trondhjem #2 +Fram2 +fun5
DDE - E6 = Bodø, Hamburg #3 +fun4
Ram Jam - Black Betty = Birmingham #5 +fun4
Vance Joy - Riptide = New York #4 +fun4
KISS - Detroit Rock City = Detroit #1 +fun3
Teriyaki Boyz - Tokyo Drift (Fast & Furious) = Tokyo #1 +fun5

Number:
Plain White T's - Hey There Delilah = Thousand, two #1
Ed Sheeran - Thinking Out Loud = Seventy, twenty three, thousand #1
Backstreet Boys - I Want It That Way = 1,2 #1 +fun3
Toto - Africa = 12,30, A hundred #1 +fun4
Bill Haley & His Comets - Rock Around the Clock = One, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve #1 +Scotland3 +Fram2 +fun5
Dolly Parton - 9 to 5 = 9, 5 #1 +Scotland4 +fun4
Rihanna, Kanye West & Paul McCartney - FourFiveSeconds = three, four, five #1 +fun3
Deorro, Chris Brown - Five More Hours = Five #2
Sabrina Carpenter - Juno = One, two, five #2
Travis - Why Does It Always Rain on Me? = Seventeen #2 +fun4
salem ilese, TOMORROW X TOGETHER, Alan Walker - PS5 = Two, three, five #2 +fun4
The Offspring - You're Gonna Go Far, Kid = Thousand #2 +Sesjon2 +Fram2 +Scotland3 +fun5
Bob Marley & The Wailers - Three Little Birds = three #2 +Fram1 +fun4
Adele - Hello = a million, a thousand #2 +Scotland4 +fun4
Queen - Don't Stop Me Now = Two hundred #3 +fun4
ABBA - Gimme! Gimme! Gimme! (A Man After Midnight) = Twelve, one #3 +fun4
Eminem - Without Me = Two, ten, twenty million, thirty six #3 +Sesjon1 +Fram1 +fun4
The Offspring - Pretty Fly (For a White Guy) = Thirteen, thirty one, uno, dos, tres, cuatro, cinco, seis #3 +fun4
Justin Bieber - Baby = Thirteen #3
Justin Bieber - Beauty and a Beat = 3012, a billion, ten #3 +fun4
Capital Cities - Safe and Sound = Six #3
Pink Floyd - Wish You Were Here = two #3 +fun4
Icona Pop - I Love It = 70's, 90's #3 +fun5
Rihanna feat. Jay-Z - Umbrella = (Three), five #4
Bruno Mars - That's What I Like = Twentyfour #4 +fun3
Kaizers Orchestra - Hjerteknuser = Hundre #4 +Sesjon2 +Fram2 +fun4
Kygo & Selena Gomez - It Ain't Me = Seventeen #4 +Sesjon1 +fun3
Flow Kingz feat. Lyng - Kygo jo = Tusen mill #4
Green Day - Wake Me Up When September Ends = Seven #4 +Scotland4 +fun4
Shakira - Whenever, Wherever = ten million, two #4 +fun4
Galantis - Runaway (U & I) = A billion #4 +fun4
Amy MacDonald - This Is the Life = four #4 +fun4
The Rolling Stones - Brown Sugar = Sixteen #5
The Rolling Stones - You Can't Always Get What You Want = Fifty #5
AURORA - Runaway = seven #5 +fun4
The White Stripes - Seven Nation Army = Seven #1 +fun3
Owl City - Fireflies = Ten million, a thousand, ten thousand #2 +fun4
Eurythmics - Sweet Dreams (Are Made of This) = Seven #2 +fun4
Hannah Montana - The Best of Both Worlds = Two #3 +fun4
Eagles - Hotel California = 1969 #3 +Scotland3 +fun5
OutKast - Ms. Jackson = A trillion #3 +fun4
Earth, Wind & Fire - September = 21 #3 +fun5
Stevie Wonder - Superstition = 13 #3 +fun4
The Cranberries - Zombie = 1916 #4 +Scotland3 +Fram1 +fun5
Men at Work - Down Under = six, four #4 +fun5
Lost Frequencies - Reality = A million #4 +fun4
AC/DC - Back in Black = nine #5 +Scotland3 +fun4
4 Non Blondes - What's Up = 25 #5 +Scotland4 +fun4
Earth, Wind & Fire - Let's Groove = 747 #5 +fun3
Joan Jett & the Blackhearts - I Love Rock 'n Roll = seventeen #5 +fun4
Bon Jovi - Wanted Dead or Alive = Six, A million #5 +fun4
The Buggles - Video Killed the Radio Star = 52, one #4 +fun4
Adele - Skyfall = ten, a thousand #3 +fun3
Far East Movement, The Cataracs, Dev - Like a G6 = 6, 808, three #1 +fun3
Simple Plan - I'm Just a Kid = Seven, eleven, four #5 +fun3
System of a Down - Toxicity = 7.0 #4 +fun4
Fort Minor - Remember the Name = ten, fifteen, twenty, five, fifty, A hundred #1 +fun3
Green Day - 21 Guns = one, twentyone #3 +fun4
Sean Kingston - Beautiful Girls = 99 #5 +fun4
Vanessa Carlton - A Thousand Miles = A thousand #1 +fun4
Coolio, L.V. - Gangsta's Paradise = 23, 24 #4 +fun5
N.W.A. - Straight Outta Compton = 47 #5 +Fram1 +fun4
Empire of the Sun - Walking on a Dream = One, Two #3 +fun3

Drink:
Sabrina Carpenter - Espresso = -Espresso, coffee, Mountain Dew #1/3
Rupert Holmes - Escape (The Piña Colada Song) = pina coladas, champagne #1 +Fram1 +fun4
The Champs - Tequila = Tequila #1 +Scotland3 +fun5
Kygo & Selena Gomez - It Ain't Me = Whiskey #2
Billy Joel - Piano Man = Gin, tonic, beer #2 +fun4
Postgirobygget - Idyll = Øl #2 +fun4
Don McLean - American Pie = Whiskey #3 +fun3
Camila Cabello & Shawn Mendes - Señorita = Tequila sunrise #3
Bruno Mars - That's What I Like = Champagne #4 +fun3
Eminem - Without Me = Vodka #4
Eminem feat. Dido - Stan = (Tea), vodka #4 +Sesjon1 +Scotland3 +fun5
Lorde - Royals = Grey Goose, Cristal #5
Postgirobygget - En Solskinnsdag = Veuve Cliquot #5 +Scotland3 +fun5
Ghost - Mary on a Cross = Bloody Mary #3 +Scotland3 +Fram1 +fun4
Eagles - Hotel California = Wine, Champagne #3 +fun5
Men at Work - Down Under = Beer #4 +fun3
Boney M. - Rasputin = Wine #5 +fun4
Chumbawamba - Tubthumping = Whiskey, Vodka, Cider, Lager #4 +Fram1 +fun5
Ricky Martin - Livin' la Vida Loca = Champagne, Mocha, Water #3 +fun4
Daniel Powter - Bad Day = Coffee #4 +fun3
Kesha - TiK ToK = Jack, Beer #3 +fun4
Far East Movement, The Cataracs, Dev - Like a G6 = Möet, Crystal #5 +fun3
Black Eyed Peas - My Humps = Milk #5 +fun5
Eminem, Nate Dogg - Shake That = Hennessy, Champagne #3 +fun5

Car:
Don McLean - American Pie = Chevy #1 +Test +Scotland1 +fun3
Vassendgutane - Granada = Granada, Lada, BMW #1 +Fram4 +fun5
Chainsmokers, Halsey - Closer = Rover #2 +Test +Scotland1 +fun4
Bruno Mars - That's What I Like = Cadillac #3 +Test +fun4
CeeLo Green - Fuck You = Ferrari #3 +Scotland1 +fun3
Lorde - Royals = Cadillac, Maybach #4 +Test +Scotland1 +fun4
The Weeknd, Daft Punk - Starboy = Lamborghini, Roadster SV #5 +Test +fun2
The Offspring - Pretty Fly (For a White Guy) = Pinto #5 +fun4
Chris Brown feat. Lil Wayne & Busta Rhymes - Look at Me Now = Lamborghini #5 +fun3
Eagles - Hotel California = Mercedes Benz #2 +Fram4 +fun4
AC/DC - Back in Black = Cadillac #3 +Fram4 +fun3
Lil Nas X & Billy Ray Cyrus - Old Town Road = Porsche, Maserati #4 +Fram4 +fun3
50 Cent - In da Club = Benz #5 +Fram4 +Scotland1 +fun4
Akon, Eminem - Smack That = Lamborghini Gallardo #3 +fun5
Eminem, Nate Dogg - Shake That = Hummer #4 +fun5

Name:
Taylor Swift - The Fate of Ophelia = Ophelia #1
Bon Jovi - Livin' on a Prayer = Tommy, Gina #1
Eminem - Mockingbird = Hailie, Lainie #2
Billy Joel - Piano Man = John, Davy, Paul #2
The Rolling Stones - Angie = Angie #2 +Fram4 +Scotland4 +fun5
Chuck Berry - Johnny B. Goode = Johnny B. Goode #2 +fun4
Eminem - Without Me = Ms. Cheney, Debbie, Elvis, Moby, Chris Kirkpatrick #3 +fun4
Eminem, Nate Dogg - Till I Collapse = Kim Mathers, Andre, Reggie, Jay, Jada, Bobby, Whitney #3 +Scotland2 +fun4
Bryan Adams - Summer of '69 = Jimmy, Jody #3
Train - Hey, Soul Sister = Madonna #3
Bonnie Tyler - Holding Out for a Hero = Hercules #3 +fun5
Postgirobygget - En Solskinnsdag = Andersen #3 +fun5
Don McLean - American Pie = Jack Flash, James Dean, Lenin, Marx #4
Foster the People - Pumped Up Kicks = Robert #4
Lynyrd Skynyrd - Sweet Home Alabama = Neil Young, Montgomery #4 +fun5
Boston - More Than a Feeling = Marianne #4 +fun4
Amy MacDonald - This Is the Life = Jimmy, Robert Riger #4 +Scotland4 +fun5
Michael Jackson - They Don't Care About Us = Roosevelt, Martin Luther #5
Ed Sheeran - I See Fire = Durin #5 +Scotland2 +Sesjon3 +Fram3 +fun4
Macklemore & Ryan Lewis, Wanz - Thrift Shop = R. Kelly, John Wayne, Gucci #5
Neil Diamond - Sweet Caroline = Caroline #1 +fun4
OutKast - Ms. Jackson = Jackson #1 +Scotland4 +Fram2 +fun4
Paul Simon - You Can Call Me Al = Al, Betty #1 +Fram4 +Scotland2 +fun4
Ghost - Mary on a Cross = Mary #2 +fun4
Miley Cyrus - Party in the U.S.A. = Jay, Britney #3 +Fram4 +Scotland4 +fun5
Britney Spears - If U Seek Amy = Amy #4 +Fram4 +fun4
Stig Brenner - Lianer = Tommy, Mowgli, Moland, Konan #5 +fun4
Vinskvetten - Dans på Grasdal = Kåren, Merete, Ingolf #3 +fun4
DDE - E6 = Jesus #5 +Fram2 +fun5
Ram Jam - Black Betty = Betty #2 +fun4
Dexys - Come On Eileen = Johnny Ray, -Eileen #1/5 +fun1
Maroon 5 - Moves Like Jagger = Jagger #1 +fun3
Kenny Loggins - Footloose = Jack, Marie, Louise, Milo #2 +Fram2 +fun5
Elton John - Candle in the Wind = Norma Jean, Marylin Monroe #2 +fun4
Kesha - TiK ToK = Mick jagger, Jack #3 +fun3
Tom Petty - Free Fallin' = Jesus, Elvis #3 +fun4
Tenacious D - Fuck Her Gently = Sally #4 +fun5

Instrument:
ABBA - Dancing Queen = Tambourine #2 +fun4
Timmy Trumpet & Savage - Freaks = Bass, Trumpet #3 +fun4
Chuck Berry - Johnny B. Goode = Guitar, Bell #4 +fun4
Paul McCartney, Stevie Wonder - Ebony and Ivory = Piano #1 +fun3
Lou Bega - Mambo No. 5 (A Little Bit of...) = Trumpet #5 +fun4

Drugs:
Queen - Don't Stop Me Now = Ecstasy #2 +fun4
Eminem, Nate Dogg - Till I Collapse = Penicillin, amoxicillin, smack #5 +fun4

Company:
Sabrina Carpenter - Espresso = Nintendo #4 +fun3
CeeLo Green - Fuck You = Atari #5 +fun3

Swearword:
CeeLo Green - Fuck You = -Fuck, shit #1/3 +fun3
Sabrina Carpenter - Espresso = Fuck #3 +fun3

Clothing:
Postgirobygget - En Solskinnsdag = Bluser, bh #3 +fun5
Lana Del Rey - Summertime Sadness = Dress #3 +fun4
The Rolling Stones - Angie = Coat #5 +fun4
Miley Cyrus - Party in the U.S.A. = Cardigan, Stillettos #3 +fun3
The Neighbourhood - Sweater Weather = Sweater, shirt, blouse #3 +fun4
Dexys - Come On Eileen = Dress #3 +fun4

Band:
George Michael - Careless Whisper = silver #4


BONUS:
Instrument | ABBA - Dancing Queen = Tambourine #2 +Scotland1 +Fram1
Instrument | Chuck Berry - Johnny B. Goode = Guitar, Bell #4 +Scotland1

Clothing | Lana Del Rey - Summertime Sadness = Dress #3 +Scotland1
City | Train - Drive By = L.A., New York, Santa Fe #2 +Scotland1
Name | Neil Diamond - Sweet Caroline = Caroline #1 +Scotland1
Name | Bryan Adams - Summer of '69 = Jimmy, Jody #3 +Scotland1
Country | The White Stripes - Seven Nation Army = England #3 +Scotland2
Country | R.E.M. - Man on the Moon = Egypt #5
Colour | Elton John - Your Song = Green / Blue #3
Drink | Bruno Mars - That's What I Like = Champagne #4
Car | The Offspring - Pretty Fly (For a White Guy) = Pinto #5 +Scotland2
Car | Eagles - Hotel California = Mercedes Benz #2 +Scotland2
Name | Bon Jovi - Livin' on a Prayer = Tommy, Gina #1 +Scotland3
Name | Eminem - Mockingbird = Hailie, Lainie #2 +Scotland3
Name | Train - Hey, Soul Sister = Madonna #3 +Scotland3
Food | ZZ Top - Burger Man = Burger #4 +Scotland3
Swearword | CeeLo Green - Fuck You = -Fuck, shit #3
Food | Steve Miller Band - The Joker = Peaches #3 +Fram1
Colour | AC/DC - Back in Black = Black #1 +Scotland4
Colour | Nik Kershaw - Wouldn't It Be Good = Green #3 +Scotland4
Bodypart | Dolly Parton - Jolene = hair, skin, eyes #3
Bodypart | The Clash - Should I stay or should I go = Back #4 +Scotland4
Animal | David Guetta feat. Sia - She Wolf (Falling to Pieces) = Wolf, deer #3
Animal | The Black Keys - Howlin' for You = Mockingbird #5

Bodypart | The Beatles - Come Together = Hair, knees, feet #3 +Scotland2
Animal | The White Stripes - Seven Nation Army = Hounds #4 +Scotland2
Number | Toto - Africa = 12,30, A hundred #1 +Scotland2
City | Dropkick Murphys - I'm Shipping Up to Boston = Boston #1 +Scotland3
Number | Deorro, Chris Brown - Five More Hours = Five #2 +Scotland4
Number | Bob Marley & The Wailers - Three Little Birds = three #2 +Scotland4
City | Teriyaki Boyz - Tokyo Drift (Fast & Furious) = Tokyo #1 +Fram1
Number | Eurythmics - Sweet Dreams (Are Made of This) = Seven #2 +Scotland4 +Fram1

Drink | The Champs - Tequila = Tequila #1 +Fram1
Bodypart | Miles Teller, Goose - Great Balls of Fire = Brain, Nails, Thumbs #4 +Fram1
Instrument | Lou Bega - Mambo No. 5 (A Little Bit of...) = Trumpet #5 +Fram2
Clothing | The Rolling Stones - Angie = Coat #5 +Scotland3 +Fram2
Car | Eminem, Nate Dogg - Shake That = Hummer #4 +Fram2
Name | Vinskvetten - Dans på Grasdal = Kåren, Merete, Ingolf #3 +Fram2
Drink | Ricky Martin - Livin' la Vida Loca = Champagne, Mocha, Water #3 +Fram2
Number | Coolio, L.V. - Gangsta's Paradise = 23, 24 #4 +Fram2
Instrument | Timmy Trumpet & Savage - Freaks = Bass, Trumpet #3 +Fram3
Colour | My Chemical Romance - Welcome to the Black Parade = Black #2 +Fram3
Bodypart | Aqua - Barbie Girl = Hair, Knees #1 +Fram3
Animal | Coldplay - Paradise = Butterfly #4 +Fram3
Bodypart | Britney Spears - Toxic = Lips #2 +Fram3
Colour | Guns N' Roses - Sweet Child O' Mine = Blue #3 +Fram3
`;

/* The details half, see "song details.txt". Generated alongside the pool above
   by "answer-timestamps.py --sync-default". */
const QUIZ_DEFAULT_DETAILS_TEXT = `
Eminem - Lose Yourself
  audio: music/06 Lose Yourself.mp3
  times: Spaghetti(58.8)
  traits: genre-hiphop, year-2002
  clue: Food +Framo +Sesjon1 +Scotland2 +Fram1 +fun5

Vinskvetten - No e da helg
  audio: music/No e'da helg.mp3
  times: Brelett(47.7)
  traits: norsk, genre-rock
  clue: Food +Framo +Sesjon1 +Fram1 +fun5

Ed Sheeran - Don't
  audio: music/04 Don't.mp3
  times: Pizza(77.1)
  traits: genre-pop, year-2014
  clue: Food +Framo +Sesjon1 +Scotland2 +fun2

Broiler - Powerbeat
  audio: music/Powerbeat.mp3
  times: Reke(30.0)
  traits: genre-electronic
  clue: Food +Framo +Fram3 +fun4

Bruno Mars - That's What I Like
  audio: music/04 That's What I Like.mp3
  times: Lobster tail(21.6), scampi(24.5), strawberry(49.4), white(65.7), Paris(90.3), Champagne(50.4), Cadillac(31.9), Gold(45.3), Manhattan(4.7), Miami(19.0), Twentyfour(91.9)
  traits: genre-pop, year-2016
  clue: City +Sesjon3 +fun3

Flow Kingz feat. Lyng - Kygo jo
  audio: music/01 Kygo Jo (feat. Lyng) - Kygo Remix.mp3
  times: kransekaka(99.2), Tusen mill(29.4)
  traits: norsk, genre-electronic
  clue: Number +fun3

Michael Jackson - They Don't Care About Us
  audio: music/They Don't Care About Us.mp3
  times: Dog food(42.4), Roosevelt(157.2), Martin Luther(210.3)
  traits: genre-pop, year-1995
  clue: Food @10 +Framo +fun3
  clue: Name +Fram4 +fun3

Gorillaz - Feel Good Inc
  audio: music/06 Feel Good Inc.mp3
  times: Chocolate(102.4), Camel(36.1), cats(98.0), ponies(100.7)
  traits: genre-electronic, year-2005
  clue: Food +Sesjon1 +fun4

Shakira, Burna Boy - Dai Dai
  audio: music/Dai Dai.mp3
  times: England(42.8), Brazil(160.5), Argentina(161.5), Colombia(162.0), Uruguay(161.0), US(163.4), Germany(163.9), France(164.4), South Africa(164.6), Spain(165.0), Mexico(165.6), Japan(166.1), South Korea(167.3), Netherlands(168.2)
  traits: genre-pop
  clue: Country +Framo +Sesjon2 +Test +Scotland1 +Fram2 +fun3

Childish Gambino - This Is America
  audio: music/This Is America.mp3
  times: America(49.5)
  traits: genre-hiphop, year-2018
  clue: Country +Framo +Sesjon2 +Test +fun1

Billy Joel - We Didn't Start the Fire
  audio: music/Billy Joel - We Didn't Start the Fire (Official HD Video).mp3
  times: China(16.9), Lebanon(125.5), Arabia(151.1), Palestine(184.4), Korea(24.6), England(42.8), Congo(129.6), Iran(188.0), Afghanistan(189.5)
  traits: genre-rock, year-1989
  clue: Country +Framo +Test +Scotland1 +fun4

The White Stripes - Seven Nation Army
  audio: music/Seven Nation Army.mp3
  times: England(98.1), Hounds(99.1), Seven(18.6)
  traits: genre-rock, year-2003
  clue: Country +Sesjon2 +Fram2 +fun4

The Lumineers - Ho Hey
  audio: music/05 Ho Hey.mp3
  times: China(83.1)
  traits: genre-pop, year-2012
  clue: Country +Framo +Sesjon2 +Test +fun3

Future - Showed Up
  audio: music/Showed Up.mp3
  times: Norway(32.8)
  traits: genre-hiphop
  clue: Country +Framo +fun2

Rascal Flatts - Life Is a Highway
  audio: music/03 Life is a Highway.mp3
  times: Mozambique(86.4), Memphis(87.4), Vancouver(89.8)
  traits: genre-country, year-2006
  clue: Country +Sesjon2 +Test +Scotland1 +fun3

Thea S - Blinke Blinke Stjernelill
  audio: music/Blinke_Blinke_Stjernelill.mp3
  times: Blå(14.0)
  traits: norsk, genre-kids
  clue: Colour +Framo +Sesjon3 +Fram3 +fun3

The Rolling Stones - Paint It, Black
  audio: music/01 Paint It, Black.mp3
  times: Red(15.9), black(19.0), green(88.8), blue(91.8), Face(78.8), head(34.6)
  traits: genre-rock, year-1966
  clue: Bodypart +Sesjon1 +fun3

Louis Armstrong - What a Wonderful World
  audio: music/01 What A Wonderful World.mp3
  times: Green(9.1), red(12.1), blue(36.4), white(39.9)
  traits: genre-other, year-1967
  clue: Colour +Sesjon1 +Scotland4 +fun3

The Police - Roxanne
  audio: music/03 Roxanne.mp3
  times: Red(23.1)
  traits: genre-rock, year-1978
  clue: Colour +Framo +Sesjon3 +Fram3 +Scotland4 +fun3

John Denver - Take Me Home, Country Roads
  audio: music/01 Take Me Home, Country Roads.mp3
  times: Blue(12.3)
  traits: genre-country, year-1971
  clue: Colour +Sesjon1 +Test +Scotland1 +fun3

Elton John - Your Song
  audio: music/Elton John - Your Song.mp3
  times: Green(147.8), Blue(149.8)
  traits: genre-pop, year-1970
  clue: Colour +Framo +Sesjon3 +fun3

Travis - Why Does It Always Rain on Me?
  audio: music/07 Why Does It Always Rain On Me.mp3
  times: Blue(135.0), Seventeen(69.5)
  traits: genre-rock, year-1999
  clue: Colour +Sesjon1 +Scotland1 +fun4

Nik Kershaw - Wouldn't It Be Good
  audio: music/02 Wouldn't It Be Good.mp3
  times: Green(60.0)
  traits: genre-pop, year-1984

Muse - Uprising
  audio: music/01 Uprising.mp3
  times: Green(28.4), red(74.1), Eye(132.3), Cat(142.2)
  traits: genre-rock, year-2009
  clue: Animal +Sesjon2 +Scotland2 +Fram2 +fun3

Ed Sheeran - Thinking Out Loud
  audio: music/11 Thinking out Loud.mp3
  times: Green(133.3), Seventy(29.9), twenty three(41.9), thousand(85.2)
  traits: genre-pop, year-2014
  clue: Number +Sesjon1 +fun2

George Ezra - Shotgun
  audio: music/04 Shotgun.mp3
  times: Yellow(27.4), green(28.4)
  traits: genre-pop, year-2018

Nomy - Cocaine
  audio: music/01 Cocaine.mp3
  times: White(95.5)
  traits: explicit, genre-rock
  clue: Colour +Sesjon3 +Scotland1 +fun5

Rusted Root - Send Me on My Way
  audio: music/03 Send Me On My Way.mp3
  times: Golden(35.5), Hand(20.3)
  traits: genre-rock, year-1994
  clue: Bodypart +Sesjon3 +Fram3 +fun4

David Guetta feat. Sia - Titanium
  audio: music/02 Titanium.mp3
  times: Titanium(66.4), Bones(113.2)
  traits: genre-electronic, year-2011

Eminem - Brainless
  audio: music/10 Brainless.mp3
  times: Orange(138.5), Red(191.6)
  traits: genre-hiphop, year-2013
  clue: Colour +Framo +Sesjon1 +fun3

Ed Sheeran - I See Fire
  audio: music/14 I See Fire.mp3
  times: Auburn(66.0), Durin(28.1)
  traits: genre-pop, year-2013
  clue: Colour +fun4

Coldplay - Viva La Vida
  audio: music/07 Viva La Vida.mp3
  times: Silver(130.2), Jerusalem(70.6)
  traits: genre-rock, year-2008
  clue: City +Sesjon3 +fun4

Dean Martin - That's Amore
  audio: music/01 That's Amore.mp3
  times: Eye(23.4), feet(72.3), heart(146.6), Tarantella(54.7)
  traits: genre-other, year-1953
  clue: Bodypart +Framo +Sesjon2 +fun3
  clue: Animal +Framo +Test +Scotland1 +Fram4 +fun5
  trivia: Animal | Describe the tarantella (as in the song) = Gay, Lucky fella

Artemas - I Like the Way You Kiss Me
  audio: music/01 i like the way you kiss me.mp3
  times: Lips(32.3), knees(35.4)
  traits: genre-pop, year-2024
  clue: Bodypart +Sesjon3 +Scotland1 +Fram3 +fun4

Alice Cooper - Poison
  audio: music/01 Poison.mp3
  times: Lips(71.3), blood(43.8), veins(80.1), mouth(95.0), skin(102.7)
  traits: genre-rock, year-1989
  clue: Bodypart +Sesjon1 +Test +Scotland2 +Fram1 +fun5

Dropkick Murphys - I'm Shipping Up to Boston
  audio: music/11 I'm Shipping Up To Boston.mp3
  times: Leg(46.8), Boston(75.0)
  traits: genre-rock, year-2005
  clue: Bodypart +Framo +Sesjon1 +Fram1 +Scotland2 +fun5

Eminem - Mockingbird
  audio: music/16 Mockingbird.mp3
  times: Lip(17.4), eyes(32.2), bum(125.5), head(86.8), Novara(158.0), Hailie(22.4), Lainie(41.7), heart(147.1), piggy(139.6), Mockingbird(228.5)
  traits: genre-hiphop, year-2004
  clue: Name +Sesjon3 +fun4

Frank Sinatra - Saturday Night (Is The Loneliest Night In The Week)
  audio: music/05 Saturday Night (Is The Loneliest Night In The Week).mp3
  times: Cheek(18.7)
  traits: genre-other, year-1944
  clue: Bodypart +Sesjon2 +fun1

Camila Cabello - Havana
  audio: music/04 Havana (feat. Young Thug).mp3
  times: Heart(12.6), Atlanta(18.4), Havana(8.8)
  traits: genre-pop, year-2017
  clue: City +Scotland3 +fun3

Metallica - Nothing Else Matters
  audio: music/08 Nothing Else Matters - Remastered 2021.mp3
  times: Heart(67.8)
  traits: genre-metal, year-1991

Leonard Cohen - Hallelujah
  audio: music/05 Hallelujah.mp3
  times: Hair(84.1), lips(86.6), tongue(196.4)
  traits: genre-other, year-1984
  clue: Bodypart +Framo +fun4

Sabrina Carpenter - Espresso
  audio: music/01 Espresso.mp3
  times: Skin(51.5), finger(96.3), Espresso(18.2), coffee(58.7), Mountain Dew(56.8), Nintendo(22.4), Fuck(34.4)
  traits: explicit, genre-pop, year-2024
  clue: Drink +Sesjon1 +fun3

Camila Cabello & Shawn Mendes - Señorita
  audio: music/01 Señorita.mp3
  times: Lips(116.1), tongue(118.2), Miami(33.7), Tequila sunrise(53.8)
  traits: genre-pop, year-2019
  clue: Drink +Sesjon1 +fun4

Foster the People - Pumped Up Kicks
  audio: music/02 Pumped Up Kicks.mp3
  times: Mouth(46.0), hand(35.3), hair(120.3), Robert(33.8)
  traits: genre-rock, year-2010
  clue: Name +Sesjon3 +Scotland2 +Fram3 +fun4

Kygo & Selena Gomez - It Ain't Me
  audio: music/03 It Ain't Me.mp3
  times: Eye(22.0), Seventeen(101.4), Whiskey(12.7)
  traits: genre-electronic, year-2017
  clue: Drink +Sesjon1 +Fram1 +Scotland3 +fun4

Jimmy Eat World - The Middle
  audio: music/The Middle.mp3
  times: Heart(137.3), Head(29.4)
  traits: genre-rock, year-2001
  clue: Bodypart +Framo +Sesjon3 +Scotland1 +Fram3 +fun5

ABBA - The Winner Takes It All
  audio: music/02 The Winner Takes It All.mp3
  times: Arms(80.4), hand(215.1)
  traits: genre-pop, year-1980
  clue: Bodypart +Sesjon2 +Test +Scotland4 +fun3

Blur - Song 2
  audio: music/02 Song 2.mp3
  times: Head(29.4)
  traits: genre-rock, year-1997

Queen - Somebody to Love
  audio: music/06 Somebody To Love.mp3
  times: Feet(31.5), bones(68.2)
  traits: genre-rock, year-1976
  clue: Bodypart +fun4

Donny Osmond, Shang - I'll Make a Man Out of You
  audio: music/03 I'll Make a Man Out of You.mp3
  times: Spine(67.6)
  traits: genre-soundtrack, year-1998

MGMT - Kids
  audio: music/05 Kids.mp3
  times: Knees(57.1)
  traits: genre-electronic, year-2007
  clue: Bodypart +Framo +Sesjon2 +Scotland1 +fun5

Metallica - Master of Puppets
  audio: music/02 Master Of Puppets.mp3
  times: Veins(69.0)
  traits: genre-metal, year-1986

CeeLo Green - Fuck You
  audio: music/17 Fuck You.mp3
  times: Ass(111.5), chest(32.3), Ferrari(40.4), Atari(48.2), Fuck(12.9), shit(29.1)
  traits: explicit, genre-pop, year-2010
  clue: Bodypart +Sesjon1 +Test +fun3

The Tokens - The Lion Sleeps Tonight
  audio: music/07 The Lion Sleeps Tonight.mp3
  times: Lion(35.5)
  traits: genre-other, year-1961
  clue: Animal +Framo +Sesjon2 +Scotland2 +Fram4 +fun3

DJ MøMø, Kjartan Lauritzen - Badebussen
  audio: music/01 Badebussen (feat. Kjartan Lauritzen).mp3
  times: Høne(56.8), mus(57.8), løve(58.7), pus(59.7), elefant(15.6), hest(16.6)
  traits: norsk, genre-kids
  clue: Animal +Framo +Sesjon3 +Test +Fram3 +Scotland4 +fun4

Queen - Don't Stop Me Now
  audio: music/12 Don't Stop Me Now.mp3
  times: Tiger(38.3), Ecstasy(22.9), Two hundred(55.1)
  traits: genre-rock, year-1978
  clue: Animal +Sesjon2 +Scotland1 +Fram2 +fun4

Killswitch Engage - Holy Diver
  audio: music/15 Holy Diver.mp3
  times: Tiger(33.4), cat(58.4)
  traits: genre-metal, year-2006
  clue: Animal +Framo +Sesjon3 +Test +Fram3 +Scotland4 +fun4

Nirvana - Smells Like Teen Spirit
  audio: music/01 Smells Like Teen Spirit.mp3
  times: Mosquito(87.0)
  traits: genre-rock, year-1991
  clue: Animal +Sesjon2 +Scotland1 +Fram2 +fun5

Thea S - Bjelleklang
  audio: music/Bjelleklang.mp3
  times: Fugl(103.5)
  traits: norsk, genre-kids
  clue: Animal +Framo +fun3

Eminem - Without Me
  audio: music/10 Without Me.mp3
  times: Fish(215.7), ten(146.5), Vodka(56.6), Ms. Cheney(70.7), Debbie(90.0), Elvis(111.3), Moby(176.1), Chris Kirkpatrick(171.9), Two(5.0), twenty million(212.5), thirty six(178.4)
  traits: genre-hiphop, year-2002
  clue: Drink +fun4

Alphaville - Forever Young
  audio: music/06 Forever Young.mp3
  times: Horse(109.6)
  traits: genre-pop, year-1984

Jonas Blue - Perfect Strangers
  audio: music/02 Perfect Strangers.mp3
  times: Human(55.4)
  traits: genre-electronic, year-2016

Sia - Chandelier
  audio: music/01 Chandelier.mp3
  times: Bird(61.3)
  traits: genre-pop, year-2014
  clue: Animal +Sesjon2 +Test +fun2

Taylor Swift - The Fate of Ophelia
  audio: music/01 The Fate of Ophelia.mp3
  times: Scorpions(98.9), Ophelia(61.9)
  traits: genre-pop, year-2025
  clue: Name +Sesjon2 +fun2

Lordi - Hard Rock Hallelujah
  audio: music/07 Hard Rock Hallelujah.mp3
  times: Lambs(52.2)
  traits: genre-metal, year-2006
  clue: Animal +Sesjon3 +Scotland4 +fun3

Journey - Don't Stop Believin'
  audio: music/02 Don't Stop Believin'.mp3
  times: Detroit(39.2)
  traits: genre-rock, year-1981
  clue: City +Sesjon3 +Scotland3 +Fram2 +fun4

Plain White T's - Hey There Delilah
  audio: music/13 Hey There Delilah.mp3
  times: New York(12.0), Thousand(13.8), two(158.7)
  traits: genre-pop, year-2006
  clue: Number +Sesjon2 +Fram1 +fun4
  trivia: What sport does Delilah compete in now? = Steeplechase (Running)

Scorpions - Wind of Change
  audio: music/04 Wind Of Change.mp3
  times: Moskva(23.6)
  traits: genre-rock, year-1990

Train - Drive By
  audio: music/02 Drive By.mp3
  times: L.A.(13.0), New York(14.0), Santa Fe(14.5)
  traits: genre-pop, year-2012

The Rolling Stones - Brown Sugar
  audio: music/08 Brown Sugar.mp3
  times: New Orleans(36.0), Sixteen(148.6)
  traits: genre-rock, year-1971
  clue: Number +Sesjon2 +Fram2 +fun4

Clean Bandit, Jess Glynne - Rather Be
  audio: music/30 Rather Be.mp3
  times: Kyoto(50.5)
  traits: genre-electronic, year-2014
  clue: City +Sesjon3 +fun4

The Rolling Stones - Sympathy for the Devil
  audio: music/13 Sympathy For The Devil.mp3
  times: St. Petersburg(74.3), Bombay(146.8)
  traits: genre-rock, year-1968

Alan Walker - Faded
  audio: music/01 Faded.mp3
  times: Atlantis(57.5)
  traits: genre-electronic, year-2015

Deorro, Chris Brown - Five More Hours
  audio: music/01 Five More Hours.mp3
  times: Five(37.0)
  traits: genre-electronic, year-2015
  clue: Number +Sesjon1 +fun4

Sabrina Carpenter - Juno
  audio: music/10 Juno.mp3
  times: One(56.5), two(59.0), five(72.4)
  traits: genre-pop, year-2024
  clue: Number +fun2

salem ilese, TOMORROW X TOGETHER, Alan Walker - PS5
  audio: music/03 PS5.mp3
  times: Two(98.3), three(43.6), five(39.8)
  traits: genre-pop, year-2021

The Offspring - You're Gonna Go Far, Kid
  audio: music/03 You're Gonna Go Far, Kid.mp3
  times: Thousand(39.5)
  traits: genre-rock, year-2008

ABBA - Gimme! Gimme! Gimme! (A Man After Midnight)
  audio: music/13 Gimme! Gimme! Gimme! (A Man After Midnight).mp3
  times: Twelve(37), one(60.4)
  traits: genre-pop, year-1979

The Offspring - Pretty Fly (For a White Guy)
  audio: music/04 Pretty Fly (For A White Guy).mp3
  times: Thirteen(128.9), thirty one(130.4), uno(27.7), dos(28.2), tres(28.2), cuatro(28.7), cinco(29.2), seis(30.2), Pinto(92.0)
  traits: genre-rock, year-1998

Justin Bieber - Baby
  audio: music/01 Baby.mp3
  times: Thirteen(134.0)
  traits: genre-pop, year-2010
  clue: Number +fun5

Justin Bieber - Beauty and a Beat
  audio: music/10 Beauty And A Beat.mp3
  times: 3012(31.6), a billion(25.4), ten(155.4)
  traits: genre-pop, year-2012

Capital Cities - Safe and Sound
  audio: music/01 Safe and Sound.mp3
  times: Six(87.0)
  traits: genre-electronic, year-2011
  clue: Number +Sesjon2 +Fram2 +Scotland4 +fun5

Rihanna feat. Jay-Z - Umbrella
  audio: music/01 Umbrella.mp3
  times: Three(7.9), five(21.4)
  traits: genre-pop, year-2007
  clue: Number +fun1

Kaizers Orchestra - Hjerteknuser
  audio: music/07 Hjerteknuser.mp3
  times: Hundre(69.9)
  traits: norsk, genre-rock, year-2005

The Rolling Stones - You Can't Always Get What You Want
  audio: music/09 You Can't Always Get What You Want.mp3
  times: Fifty(151.6)
  traits: genre-rock, year-1969
  clue: Number +Sesjon1 +fun2

Billy Joel - Piano Man
  audio: music/02 Piano Man.mp3
  times: Gin(45.6), tonic(44.6), loneliness(200.2), beer(275.7), John(116.7), Davy(172.3), Paul(163.7)
  traits: genre-rock, year-1973
  clue: Name +Sesjon2 +Scotland2 +Fram3 +fun4
  trivia: Drink | Name the metaphorical drink = Loneliness

Don McLean - American Pie
  audio: music/01 American Pie.mp3
  times: Whiskey(76.8), Chevy(69.6), Jack Flash(334.9), James Dean(183.5), Lenin(206.2), Marx(208.2)
  traits: genre-rock, year-1971
  clue: Name +Sesjon2 +Fram2 +fun3

Eminem feat. Dido - Stan
  audio: music/03 Stan.mp3
  times: vodka(236.3), Tea(1.2)
  traits: genre-hiphop, year-2000

Lorde - Royals
  audio: music/03 Royals.mp3
  times: Grey Goose(24.2), Cristal(35.0), Maybach(35.5), Cadillac(31.9)
  traits: genre-pop, year-2013
  clue: Drink +Sesjon1 +Fram1 +fun4

The Weeknd, Daft Punk - Starboy
  audio: music/01 Starboy.mp3
  times: Roadster SV(83.8), Lamborghini(24.5)
  traits: genre-pop, year-2016

Chainsmokers, Halsey - Closer
  audio: music/01 Closer.mp3
  times: rover(54.5)
  traits: genre-electronic, year-2016

Bon Jovi - Livin' on a Prayer
  audio: music/03 Livin' On A Prayer.mp3
  times: Tommy(45.8), Gina(61.6)
  traits: genre-rock, year-1986
  clue: Name +Sesjon3 +Fram3 +fun4

Eminem, Nate Dogg - Till I Collapse
  audio: music/18 Till I Collapse.mp3
  times: Kim Mathers(217.9), Andre(148.3), Reggie(145.7), Jay(146.7), Jada(149.3), Bobby(166.5), Whitney(167.0), Penicillin(74.5), amoxicillin(77.0), smack(217.4)
  traits: genre-hiphop, year-2002

Bryan Adams - Summer of '69
  audio: music/06 Summer Of '69.mp3
  times: Jimmy(25.0), Jody(26.0)
  traits: genre-rock, year-1984
  clue: Name +Sesjon2 +Fram2 +fun4

Train - Hey, Soul Sister
  audio: music/02 Hey, Soul Sister.mp3
  times: Madonna(113.3)
  traits: genre-pop, year-2009
  clue: Name +Sesjon3 +Fram3 +fun4

Macklemore & Ryan Lewis, Wanz - Thrift Shop
  audio: music/03 Thrift Shop (feat. Wanz).mp3
  times: R. Kelly(62.7), John Wayne(96.5), Gucci(155.8)
  traits: genre-hiphop, year-2012
  clue: Name +Sesjon2 +Scotland4 +fun4

ABBA - Dancing Queen
  audio: music/02 Dancing Queen.mp3
  times: Tambourine(100.6)
  traits: genre-pop, year-1976

ZZ Top - Burger Man
  audio: music/Burger Man.mp3
  times: Burger(30.2)
  traits: genre-rock
  clue: Food +fun4

Survivor - Eye of the Tiger
  audio: music/Eye of the Tiger.mp3
  times: Tiger(85.4)
  traits: genre-rock, year-1982
  clue: Animal +Sesjon3 +Test +Scotland1 +Fram3 +fun4

The Beatles - Come Together
  audio: music/Come Together - Remastered 2009.mp3
  times: Hair(24.6), knees(28.1), feet(99.7)
  traits: genre-rock, year-1969
  clue: Bodypart +Sesjon2 +fun4

Jet - Are You Gonna Be My Girl
  audio: music/Are You Gonna Be My Girl.mp3
  times: Hair(54.9), hand(32.1)
  traits: genre-rock, year-2003
  clue: Bodypart +fun3

Postgirobygget - En Solskinnsdag
  audio: music/03 En Solskinnsdag.mp3
  times: Krabber(75.1), hvit(91.0), røde(138.8), Veuve Cliquot(142.3), Andersen(26.3), Bluser(36.1), bh(52.3)
  traits: norsk, genre-pop, year-1996

Shaggy feat. Rikrok - It Wasn't Me
  audio: music/03 It Wasn't Me.mp3
  times: Honey(20.5), red(22.0)
  traits: genre-reggae, year-2000

Red Hot Chili Peppers - Californication
  audio: music/06 Californication.mp3
  times: China(22.1), Sweden(27.1), Silver(28.1)
  traits: genre-rock, year-1999

Shakira - Hips Don't Lie
  audio: music/03 Hips Don't Lie (feat. Wyclef Jean).mp3
  times: Colombia(148.5), Haiti(178.0), Hips(31.6)
  traits: genre-pop, year-2006

R.E.M. - Man on the Moon
  audio: music/10 Man On The Moon.mp3
  times: Egypt(113.5)
  traits: genre-rock, year-1992

Lynyrd Skynyrd - Sweet Home Alabama
  audio: music/01 Sweet Home Alabama.mp3
  times: Blue(78.9), Birmingham(102.1), Neil Young(63.2), Montgomery(252.1)
  traits: genre-rock, year-1974

Postgirobygget - Idyll
  audio: music/06 Idyll.mp3
  times: rød(36.1), Øl(37.4)
  traits: norsk, genre-pop, year-1996

Soundgarden - Black Hole Sun
  audio: music/07 Black Hole Sun.mp3
  times: Black(39.0)
  traits: genre-rock, year-1994

Guns N' Roses - Sweet Child O' Mine
  audio: music/09 Sweet Child O' Mine.mp3
  times: Blue(56.4)
  traits: genre-rock, year-1987

Swedish House Mafia, John Martin - Don't You Worry child
  audio: music/01 Don't You Worry Child (feat. John Martin) - Radio Edit.mp3
  times: Blue(40.1)
  traits: genre-electronic, year-2012

Lana Del Rey - Summertime Sadness
  audio: music/11 Summertime Sadness.mp3
  times: Red(34.7), Dress(35.2)
  traits: genre-pop, year-2012

Inner Circle - Sweat (A La La La La Long)
  audio: music/02 Sweat (A La La La La Long).mp3
  times: Brown(39.9)
  traits: genre-reggae, year-1992

Calvin Harris - Summer
  audio: music/08 Summer.mp3
  times: brown(15.0), blue(22.5)
  traits: genre-electronic, year-2014

Ed Sheeran, Camila Cabello & Cardi B - South of the Border
  audio: music/South of the Border (feat. Camila Cabello & Cardi B).mp3
  times: Brown(11.0), Green(60.0)
  traits: genre-pop, year-2019
  clue: Colour +Framo +fun3

Smash Mouth - All Star
  audio: music/05 All Star.mp3
  times: Gold(49.0)
  traits: genre-rock, year-1999

Rupert Holmes - Escape (The Piña Colada Song)
  audio: music/01 Escape (The Pina Colada Song).mp3
  times: red(130.3), Brain(55.1), pina coladas(44.4), champagne(123.6)
  traits: genre-pop, year-1979

David Guetta feat. Sia - She Wolf (Falling to Pieces)
  audio: music/03 She Wolf (Falling to Pieces) [feat. Sia].mp3
  times: Yellow(61.9), Wolf(25.8), deer(31.4)
  traits: genre-electronic, year-2012

Elvis Presley - Jailhouse Rock
  audio: music/05 Jailhouse Rock.mp3
  times: purple(39.6)
  traits: genre-rock, year-1957

Dolly Parton - Jolene
  audio: music/01 Jolene.mp3
  times: Auburn(36.2), Ivory(36.9), emerald green(38.9), hair(36.7), skin(37.4), eyes(38.4)
  traits: genre-country, year-1973

Kylie Minogue - Can't Get You Out of My Head
  audio: music/03 Can't Get You out of My Head.mp3
  times: Head(32.6), arms(80.3), heart(149.3)
  traits: genre-pop, year-2001

George Michael - Careless Whisper
  audio: music/03 Careless Whisper.mp3
  times: eyes(43.9), heart(102.8), silver(47.0)
  traits: genre-pop, year-1984

Elvis Presley - Can't Help Falling in Love
  audio: music/05 Can't Help Falling in Love.mp3
  times: Hand(86.7)
  traits: genre-other, year-1961

Creedence Clearwater Revival - Fortunate Son
  audio: music/06 Fortunate Son.mp3
  times: Hand(50.2)
  traits: genre-rock, year-1969

Stealers Wheel - Stuck in the Middle with You
  audio: music/02 Stuck In The Middle With You.mp3
  times: Back(73.3)
  traits: genre-rock, year-1972

Avicii - Waiting for Love
  audio: music/01 Waiting For Love.mp3
  times: arms(46.4)
  traits: genre-electronic, year-2015

Amy MacDonald - This Is the Life
  audio: music/02 This Is The Life.mp3
  times: hair(24.8), head(35.9), four(65.0), Jimmy(67.3), Robert Riger(76.5)
  traits: genre-pop, year-2007

Imagine Dragons - Radioactive
  audio: music/01 Radioactive.mp3
  times: Brow(33.5), Bones(58.7)
  traits: genre-rock, year-2012

The Clash - Should I stay or should I go
  audio: music/03 Should I Stay or Should I Go - Remastered.mp3
  times: Back(54.7), Black(50.6)
  traits: genre-rock, year-1982

The Rolling Stones - Angie
  audio: music/05 Angie - Remastered 2009.mp3
  times: Eyes(168.1), ear(113.1), Angie(19.2), Coat(52.5)
  traits: genre-rock, year-1973

Men Without Hats - The Safety Dance
  audio: music/01 The Safety Dance.mp3
  times: Feet(44.3)
  traits: genre-pop, year-1982

Queen & David Bowie - Under Pressure
  audio: music/11 Under Pressure (feat. David Bowie).mp3
  times: Brains(83.9)
  traits: genre-rock, year-1981

Bonnie Tyler - Holding Out for a Hero
  audio: music/20 Holding Out for a Hero.mp3
  times: Blood(196.1), Feet(120.8), Hercules(40.5)
  traits: genre-pop, year-1984

Afroman - Because I Got High
  traits: explicit, genre-hiphop, year-2000

Lynyrd Skynyrd - Free Bird
  audio: music/08 Free Bird.mp3
  times: Bird(121.2)
  traits: genre-rock, year-1973

Elvis Presley - Hound Dog
  audio: music/01 Hound Dog.mp3
  times: Dog(1.9), hound(1.4), rabbit(13.2)
  traits: genre-rock, year-1956

Toto - Africa
  audio: music/10 Africa.mp3
  times: Wild dogs(110.2), 12(44.2), 30(44.7), A hundred(82.9)
  traits: genre-rock, year-1982

The Black Keys - Howlin' for You
  audio: music/04 Howlin' for You.mp3
  times: Mockingbird(83.5)
  traits: genre-rock, year-2010

Bee Gees - Stayin' Alive
  audio: music/01 Stayin Alive.mp3
  times: New York(30.3)
  traits: genre-disco, year-1977

Backstreet Boys - I Want It That Way
  audio: music/02 I Want It That Way.mp3
  times: 1(14.9), 2(31.7)
  traits: genre-pop, year-1999

Bill Haley & His Comets - Rock Around the Clock
  audio: music/01 Rock Around The Clock.mp3
  times: One(0.7), two(1.2), three(2.7), four(3.2), five(5.0), six(5.0), seven(5.5), eight(6.0), nine(7.6), ten(7.6), eleven(8.1), twelve(8.6)
  traits: genre-rock, year-1954

Dolly Parton - 9 to 5
  audio: music/01 9 to 5.mp3
  times: 9(26.6), 5(27.1)
  traits: genre-country, year-1980

Rihanna, Kanye West & Paul McCartney - FourFiveSeconds
  audio: music/01 FourFiveSeconds.mp3
  times: three(32.7), four(28.2), five(28.7)
  traits: genre-pop, year-2015

Bob Marley & The Wailers - Three Little Birds
  audio: music/04 Three Little Birds.mp3
  times: three(46.5)
  traits: genre-reggae, year-1977

Adele - Hello
  audio: music/01 Hello.mp3
  times: a million(61.3), a thousand(74.7)
  traits: genre-pop, year-2015

Pink Floyd - Wish You Were Here
  audio: music/04 Wish You Were Here.mp3
  times: two(203.6), Blue(105.2), Green(110.2), Fish(206.1)
  traits: genre-rock, year-1975

Icona Pop - I Love It
  audio: music/01 I Love It (feat. Charli XCX).mp3
  times: 70's(64.7), 90's(66.7)
  traits: genre-pop, year-2012

Green Day - Wake Me Up When September Ends
  audio: music/07 Wake Me up When September Ends.mp3
  times: Seven(32.5)
  traits: genre-rock, year-2005

Shakira - Whenever, Wherever
  audio: music/03 Whenever, Wherever.mp3
  times: ten million(32.2), two(86.1)
  traits: genre-pop, year-2001

Galantis - Runaway (U & I)
  audio: music/04 Runaway (U & I).mp3
  times: A billion(22.6)
  traits: genre-electronic, year-2014

AURORA - Runaway
  audio: music/01 Runaway.mp3
  times: seven(35.9)
  traits: genre-pop, year-2015

The Champs - Tequila
  audio: music/01 Tequila.mp3
  times: Tequila(54.8)
  traits: genre-rock, year-1958

Vassendgutane - Granada
  audio: music/06 Granada.mp3
  times: Granada(24.5), Lada(28.5), BMW(144.2)
  traits: norsk, genre-country, year-2005

Chris Brown feat. Lil Wayne & Busta Rhymes - Look at Me Now
  audio: music/04 Look At Me Now (feat. Lil' Wayne & Busta Rhymes).mp3
  times: Lamborghini(16.6)
  traits: explicit, genre-hiphop, year-2011

Chuck Berry - Johnny B. Goode
  audio: music/06 Johnny B. Goode.mp3
  times: Johnny B. Goode(27.7), Guitar(32.2), Bell(33.7)
  traits: genre-rock, year-1958

Boston - More Than a Feeling
  audio: music/01 More Than a Feeling.mp3
  times: Marianne(70.4)
  traits: genre-rock, year-1976

Timmy Trumpet & Savage - Freaks
  audio: music/01 Freaks.mp3
  times: Bass(15.5), Trumpet(20.5)
  traits: genre-electronic, year-2014

Eagles - Hotel California
  audio: music/01 Hotel California - 2013 Remaster.mp3
  times: Pink(212.2), 1969(166.5), Wine(161.4), Champagne(212.7), Mercedes Benz(134.7)
  traits: genre-rock, year-1976

Men at Work - Down Under
  audio: music/03 Down Under.mp3
  times: Vegemite sandwich(71.7), Muscle(63.4), Jaw(124.3), Brussels(58.8), Bombay(120.6), six(61.4), four(61.9), Beer(79.5)
  traits: genre-rock, year-1981

Boney M. - Rasputin
  audio: music/03 Rasputin.mp3
  times: Russia(69.5), Head(206.9), Eyes(73.3), arms(167.1), Cat(102.8), Moscow(79.3), Wine(189.7)
  traits: genre-disco, year-1978

Miley Cyrus - Party in the U.S.A.
  audio: music/02 Party In The U.S.A.mp3
  times: U.S.A(63.6), Butterflies(47.4), L.A(11.4), Nashville(84.1), Jay(37.7), Britney(97.7), Cardigan(13.3), Stillettos(86.1)
  traits: genre-pop, year-2009

AC/DC - Back in Black
  audio: music/06 Back In Black.mp3
  times: Black(27.6), Cat(44.4), nine(42.9), Cadillac(69.8)
  traits: genre-rock, year-1980

OutKast - Ms. Jackson
  audio: music/05 Ms. Jackson.mp3
  times: pie(49.6), Fried fish(66.2), A trillion(32.1), Jackson(24.3)
  traits: genre-hiphop, year-2000

Lil Nas X & Billy Ray Cyrus - Old Town Road
  audio: music/08 Old Town Road.mp3
  times: Porsche(38.0), Bladder(59.3), booty(69.9), boobies(66.3), Horse(14.7), Maserati(111.3)
  traits: genre-hiphop, year-2019

Owl City - Fireflies
  audio: music/09 Fireflies.mp3
  times: Fireflies(25.3), Sheep(122.5), Ten million(24.8), a thousand(65.3), ten thousand(67.3)
  traits: genre-pop, year-2009

Led Zeppelin - Stairway to Heaven
  audio: music/04 Stairway to Heaven - Remaster.mp3
  times: White(419.1), Gold(58.7), songbird(110.6)
  traits: genre-rock, year-1971

Coldplay - Paradise
  audio: music/03 Paradise.mp3
  times: Eyes(88.0), Teeth(114.3), Butterfly(121.8)
  traits: genre-rock, year-2011

Miley Cyrus - Flowers
  audio: music/01 Flowers.mp3
  times: red(71.5), Gold(10.4), Hand(55.1)
  traits: genre-pop, year-2023

Aqua - Barbie Girl
  audio: music/03 Barbie Girl.mp3
  times: Pink(52.8), Hair(17.9), Knees(102.8)
  traits: genre-pop, year-1997

Neil Diamond - Sweet Caroline
  audio: music/13 Sweet Caroline.mp3
  times: Hands(44.6), Shoulders(108.0), Caroline(64.5)
  traits: genre-other, year-1969

Bruce Springsteen - Born in the U.S.A.
  audio: music/01 Born in the U.S.A.mp3
  times: U.S.A(34.7), Yellow(62.6)
  traits: genre-rock, year-1984

Bon Jovi - Wanted Dead or Alive
  audio: music/05 Wanted Dead Or Alive.mp3
  times: Horse(78.0), Six(207.2), A million(223.9)
  traits: genre-rock, year-1986

Earth, Wind & Fire - September
  audio: music/07 September.mp3
  times: golden(135.8), blue(86.7), 21(21.5)
  traits: genre-disco, year-1978

Ghost - Mary on a Cross
  audio: music/02 Mary On A Cross.mp3
  times: Bloody Mary(89.8), Mary(82.8)
  traits: genre-metal, year-2019

Stig Brenner - Lianer
  audio: music/03 Lianer.mp3
  times: Tiger(37.5), slanger(41.0), mennesker(47.0), Tommy(40.5), Mowgli(34.5), Moland(110.5), Konan(115.5)
  traits: norsk, genre-pop, year-2021

The Mamas & The Papas - California Dreamin'
  audio: music/07 California Dreamin'.mp3
  times: Knees(52.1), LA(30.1)
  traits: genre-rock, year-1965

Eurythmics - Sweet Dreams (Are Made of This)
  audio: music/06 Sweet Dreams (Are Made of This) - 2005 Remaster.mp3
  times: Seven(17.5)
  traits: genre-pop, year-1983

Stevie Wonder - Superstition
  audio: music/06 Superstition.mp3
  times: 13(48.5)
  traits: genre-other, year-1972

4 Non Blondes - What's Up
  audio: music/03 What's Up.mp3
  times: 25(30.1)
  traits: genre-rock, year-1992

The Cranberries - Zombie
  audio: music/08 Zombie.mp3
  times: 1916(167.1)
  traits: genre-rock, year-1994

Earth, Wind & Fire - Let's Groove
  audio: music/01 Let's Groove.mp3
  times: 747(68.3)
  traits: genre-disco, year-1981

Joan Jett & the Blackhearts - I Love Rock 'n Roll
  audio: music/01 I Love Rock 'N Roll.mp3
  times: seventeen(22.3)
  traits: genre-rock, year-1981

Lost Frequencies - Reality
  audio: music/05 Reality.mp3
  times: A million(27.4)
  traits: genre-electronic, year-2014

Hannah Montana - The Best of Both Worlds
  audio: music/01 The Best of Both Worlds.mp3
  times: Two(65.8)
  traits: genre-pop, year-2006

Britney Spears - Toxic
  audio: music/06 Toxic.mp3
  times: Lips(58.2)
  traits: genre-pop, year-2003

Britney Spears - If U Seek Amy
  audio: music/06 If U Seek Amy.mp3
  times: Amy(17.4)
  traits: genre-pop, year-2008

Celine Dion - My Heart Will Go On
  audio: music/12 My Heart Will Go On.mp3
  times: Heart(70.8)
  traits: genre-pop, year-1997

Carly Rae Jepsen - Call Me Maybe
  audio: music/03 Call Me Maybe.mp3
  times: Skin(23.2)
  traits: genre-pop, year-2011

Guns N' Roses - Welcome to the Jungle
  audio: music/01 Welcome To The Jungle.mp3
  times: Knees(61.7)
  traits: genre-rock, year-1987
  trivia: Bodypart | How many times is "n" repeated before he says knees? = 8

Guns N' Roses - Paradise City
  audio: music/06 Paradise City.mp3
  times: Green(24.0)
  traits: genre-rock, year-1987

Queen - We Are the Champions
  audio: music/02 We Are the Champions.mp3
  times: Face(26.5)
  traits: genre-rock, year-1977

Coldplay - Yellow
  audio: music/05 Yellow.mp3
  times: Skin(89.7), Bones(93.2)
  traits: genre-rock, year-2000

The Beatles - I Want to Hold Your Hand
  audio: music/04 I Want To Hold Your Hand - Remastered 2015.mp3
  times: Hand(19.8)
  traits: genre-rock, year-1963

Bruce Springsteen - I'm on Fire
  audio: music/06 I'm On Fire.mp3
  times: Head(90.0), Skull(80.9)
  traits: genre-rock, year-1984

50 Cent - In da Club
  audio: music/05 In Da Club.mp3
  times: Benz(38.0)
  traits: explicit, genre-hiphop, year-2003

Matthew Wilder - Break My Stride
  audio: music/01 Break My Stride.mp3
  times: China(24.3)
  traits: genre-pop, year-1983

Iggy Azalea feat. Charli XCX - Fancy
  audio: music/05 Fancy.mp3
  times: L.A(46.0), Tokyo(46.5)
  traits: genre-hiphop, year-2014

Ylvis - Jan Egeland
  audio: music/01 Jan Egeland.mp3
  times: Uganda(31.2), Congo(33.0)
  traits: norsk, genre-other, year-2012

Barry Manilow - Copacabana
  audio: music/02 Copacabana - Remastered.mp3
  times: Havana(56.8)
  traits: genre-disco, year-1978

HUNTR/X - Golden
  audio: music/04 Golden.mp3
  times: Golden(68.2)
  traits: genre-pop, year-2025

Aerosmith - Dream On
  audio: music/03 Dream On.mp3
  times: Face(46.4)
  traits: genre-rock, year-1973

Prince & The Revolution - Purple Rain
  audio: music/09 Purple Rain.mp3
  times: Purple(46.9)
  traits: genre-rock, year-1984

Van Morrison - Brown Eyed Girl
  audio: music/01 Brown Eyed Girl.mp3
  times: Brown(41.5)
  traits: genre-rock, year-1967

Billy Joel - Uptown Girl
  audio: music/06 Uptown Girl.mp3
  times: White(27.0)
  traits: genre-pop, year-1983

Paul Simon - You Can Call Me Al
  audio: music/06 You Can Call Me Al.mp3
  times: Al(56.2), Betty(53.1)
  traits: genre-pop, year-1986

Billie Eilish - Birds of a Feather
  audio: music/04 BIRDS OF A FEATHER.mp3
  times: Birds(41.6)
  traits: genre-pop, year-2024

Maroon 5 - Sugar
  audio: music/05 Sugar.mp3
  times: Sugar(39.8)
  traits: genre-pop, year-2014

Olivia Rodrigo - good 4 u
  audio: music/06 good 4 u.mp3
  times: Salt(125.9)
  traits: explicit, genre-rock, year-2021

The Neighbourhood - Sweater Weather
  audio: music/04 Sweater Weather.mp3
  times: Sweater(22.9), shirt(47.2), blouse(48.2)
  traits: genre-rock, year-2012

The Buggles - Video Killed the Radio Star
  audio: music/02 Video Killed The Radio Star.mp3
  times: 52(18.9), one(78.4)
  traits: genre-pop, year-1979

Adele - Skyfall
  audio: music/01 Skyfall.mp3
  times: ten(40.9), a thousand(126.8)
  traits: genre-pop, year-2012

Far East Movement, The Cataracs, Dev - Like a G6
  audio: music/01 Like A G6.mp3
  times: 6(11.5), 808(45.9), three(11.0), Möet(31.8), Crystal(33.5)
  traits: genre-hiphop, year-2010

Simple Plan - I'm Just a Kid
  audio: music/04 I'm Just a Kid.mp3
  times: Seven(5.5), eleven(7.5), four(53.8)
  traits: genre-rock, year-2002

System of a Down - Toxicity
  audio: music/12 Toxicity.mp3
  times: 7.0(53.9)
  traits: genre-metal, year-2001

Fort Minor - Remember the Name
  audio: music/02 Remember the Name (feat. Styles of Beyond).mp3
  times: ten(22.3), fifteen(25.3), twenty(23.8), five(28.0), fifty(29.5), A hundred(30.8)
  traits: genre-hiphop, year-2005

Green Day - 21 Guns
  audio: music/16 21 Guns.mp3
  times: one(65.3), twentyone(66.3)
  traits: genre-rock, year-2009

Sean Kingston - Beautiful Girls
  audio: music/01 Beautiful Girls.mp3
  times: 99(107.6)
  traits: genre-pop, year-2007

Vanessa Carlton - A Thousand Miles
  audio: music/03 A Thousand Miles.mp3
  times: A thousand(53.4)
  traits: genre-pop, year-2002

Coolio, L.V. - Gangsta's Paradise
  audio: music/02 Gangsta's Paradise.mp3
  times: 23(102.3), 24(104.4)
  traits: genre-hiphop, year-1995

N.W.A. - Straight Outta Compton
  audio: music/01 Straight Outta Compton.mp3
  times: 47(51.4)
  traits: genre-hiphop, year-1988

Empire of the Sun - Walking on a Dream
  audio: music/02 Walking On A Dream.mp3
  times: One(128.2), Two(50.2)
  traits: genre-electronic, year-2008

Irving Berlin - Anything You Can Do
  audio: music/29 Anything You Can Do - From 'Annie Get Your Gun' - 2025 Remaster.mp3
  times: Sparrow(66.5), Partridge(63.5)
  traits: genre-soundtrack, year-1946

Culture Club - Karma Chameleon
  audio: music/01 Karma Chameleon.mp3
  times: Red(60.1), Gold(60.5), Green(61.1), Chameleon(47.0)
  traits: genre-pop, year-1983

Cutting Crew - (I Just) Died in Your Arms
  audio: music/06 (I Just) Died In Your Arms.mp3
  times: Cat(59.8)
  traits: genre-pop, year-1986

Iron Maiden - The Trooper
  audio: music/05 The Trooper - 2015 Remaster.mp3
  times: Horse(56.1)
  traits: genre-metal, year-1983

Foo Fighters - Monkey Wrench
  audio: music/02 Monkey Wrench.mp3
  times: Monkey(44.8)
  traits: genre-rock, year-1997

Tom Petty - Free Fallin'
  audio: music/01 Free Fallin'.mp3
  times: Horses(28.9), Jesus(17.4), Elvis(27.0)
  traits: genre-rock, year-1989

Florence + the Machine - Dog Days Are Over
  audio: music/01 Dog Days Are Over.mp3
  times: Dog(64.3), Horses(70.4)
  traits: genre-pop, year-2008

Eminem - When I'm Gone
  audio: music/01 When I'm Gone.mp3
  times: Sweden(180.7)
  traits: genre-hiphop, year-2005

DDE - Vinsjan på kaia
  audio: music/24 Vinsjan På Kaia.mp3
  times: Kina(84.2), Bergen(13.1), Murmansk(14.1), Trondhjem(97.8)
  traits: norsk, genre-rock

Jennifer Lopez - On the Floor
  audio: music/01 On The Floor.mp3
  times: Brazil(74.4), Morocco(75.3)
  traits: genre-pop, year-2011

Teriyaki Boyz - Tokyo Drift (Fast & Furious)
  audio: music/01 Tokyo Drift (Fast & Furious) - From 'The Fast And The Furious- Tokyo Drift' Soundtrack.mp3
  times: Teriyaki(53.1), Japan(196.2), China(193.1), Tokyo(14.0)
  traits: genre-hiphop, year-2006

The Rolling Stones - Start Me Up
  audio: music/09 Start Me Up.mp3
  times: Green(111.6), Hands(113.1), Eyes(109.3)
  traits: genre-rock, year-1981

Ace of Base - The Sign
  audio: music/04 The Sign.mp3
  times: Eyes(55.9)
  traits: genre-pop, year-1993

Elton John - Candle in the Wind
  audio: music/02 Candle In The Wind 1997.mp3
  times: Brain(34.1), Norma Jean(14.5), Marylin Monroe(110.1)
  traits: genre-pop, year-1997

Evanescence - Bring Me to Life
  audio: music/02 Bring Me To Life.mp3
  times: eyes(167.2), blood(64.0)
  traits: genre-rock, year-2003

Miles Teller, Goose - Great Balls of Fire
  audio: music/04 Great Balls Of Fire - Live.mp3
  times: Brain(2.8), Nails(43.5), Thumbs(44.8)
  traits: genre-soundtrack, year-2022

Red Hot Chili Peppers - Otherside
  audio: music/04 Otherside.mp3
  times: throat(29.9), Guts(108.2)
  traits: genre-rock, year-1999

Kings of Leon - Sex on Fire
  audio: music/03 Sex on Fire.mp3
  times: Knuckles(78.2), Bones(116.2), Lips(75.0)
  traits: genre-rock, year-2008

Linkin Park - Crawling
  audio: music/05 Crawling.mp3
  times: Skin(89.8)
  traits: genre-rock, year-2000

Caesars - Jerk It Out
  audio: music/06 Jerk It Out.mp3
  times: Mouth(58.8), Head(66.8), Bones(45.6)
  traits: genre-rock, year-2002

Slipknot - Duality
  audio: music/04 Duality.mp3
  times: Fingers(0.7), Eyes(2.5), Skin(105.7), Bones(106.1)
  traits: genre-metal, year-2004

Limp Bizkit - Behind Blue Eyes
  audio: music/16 Behind Blue Eyes.mp3
  times: Eyes(29.1)
  traits: genre-rock, year-2003

Black Sabbath - Paranoid
  audio: music/01 Paranoid.mp3
  times: Brain(53.5)
  traits: genre-metal, year-1970

Tenacious D - Fuck Her Gently
  audio: music/06 Fuck Her Gently.mp3
  times: Teeth(65.3), Sally(61.4)
  traits: explicit, genre-rock, year-2001

Black Eyed Peas - My Humps
  audio: music/05 My Humps.mp3
  times: Coco puff(118.3), Ass(50.4), Breast(210.6), Hand(149.1), Milk(117.2)
  traits: genre-hiphop, year-2005

Akon, Eminem - Smack That
  audio: music/03 Smack That.mp3
  times: Lamborghini Gallardo(21.9)
  traits: genre-hiphop, year-2006

Eminem, Nate Dogg - Shake That
  audio: music/07 Shake That.mp3
  times: Apple(150.5), Hennessy(70.7), Champagne(140.0), Hummer(149.3)
  traits: genre-hiphop, year-2005

Ricky Martin - Livin' la Vida Loca
  audio: music/01 Livin' la Vida Loca.mp3
  times: Red(63.8), New York(90.4), Champagne(103.5), Mocha(65.7), Water(100.7)
  traits: genre-pop, year-1999

Daniel Powter - Bad Day
  audio: music/03 Bad Day.mp3
  times: Blue(23.3), Gray(25.0), Coffee(44.9)
  traits: genre-pop, year-2005

Red Hot Chili Peppers - Snow (Hey Oh)
  audio: music/02 Snow (Hey Oh).mp3
  times: White(226.3)
  traits: genre-rock, year-2006

My Chemical Romance - Welcome to the Black Parade
  audio: music/05 Welcome to the Black Parade.mp3
  times: Black(59.9)
  traits: genre-rock, year-2006

Kim Carnes - Bette Davis Eyes
  audio: music/01 Bette Davis Eyes.mp3
  times: New York(38.8)
  traits: genre-pop, year-1981

The Animals - The House of the Rising Sun
  audio: music/03 House of the Rising Sun.mp3
  times: New Orleans(15.7)
  traits: genre-rock, year-1964

DDE - E6
  audio: music/08 E6.mp3
  times: Bodø(53.5), Hamburg(31.8), Jesus(157.1)
  traits: norsk, genre-rock

Ram Jam - Black Betty
  audio: music/01 Black Betty.mp3
  times: Birmingham(213.8), Betty(35.2)
  traits: genre-rock, year-1977

Vance Joy - Riptide
  audio: music/04 Riptide.mp3
  times: New York(65.5)
  traits: genre-pop, year-2013

KISS - Detroit Rock City
  audio: music/13 Detroit Rock City.mp3
  times: Detroit(51.0)
  traits: genre-rock, year-1976

Paul McCartney, Stevie Wonder - Ebony and Ivory
  audio: music/04 Ebony And Ivory.mp3
  times: Piano(19.6)
  traits: genre-pop, year-1982

Vinskvetten - Dans på Grasdal
  audio: music/06 Dans På Grasdal.mp3
  times: Kåren(20.5), Merete(127.5), Ingolf(30.7)
  traits: norsk, genre-rock

Dexys - Come On Eileen
  audio: music/10 Come On Eileen.mp3
  times: Johnny Ray(47.5), Eileen(32.5), Dress(95.5)
  traits: genre-pop, year-1982

Maroon 5 - Moves Like Jagger
  audio: music/05 Moves Like Jagger.mp3
  times: Jagger(53.3)
  traits: genre-pop, year-2011

Kenny Loggins - Footloose
  audio: music/03 Footloose.mp3
  times: Jack(68.7), Marie(120.3), Louise(64.0), Milo(125.9)
  traits: genre-pop, year-1984

Kesha - TiK ToK
  audio: music/02 TiK ToK.mp3
  times: Beer(67.1), Mick jagger(78.6), Jack(11.0)
  traits: genre-pop, year-2009

Chumbawamba - Tubthumping
  audio: music/01 Tubthumping.mp3
  times: Whiskey(62.1), Vodka(63.3), Cider(65.6), Lager(64.5)
  traits: genre-rock, year-1997

Steve Miller Band - The Joker
  audio: music/05 The Joker.mp3
  times: Peaches(246.9)
  traits: genre-rock, year-1973

Flo Rida - Low
  audio: music/05 Low (feat. T-Pain).mp3
  times: Apple(17.5), Birthday cake(53.4)
  traits: genre-hiphop, year-2007

Katy Perry - I Kissed a Girl
  audio: music/02 I Kissed A Girl.mp3
  times: Cherry(38.7)
  traits: genre-pop, year-2008

Def Leppard - Pour Some Sugar on Me
  audio: music/05 Pour Some Sugar On Me.mp3
  times: Sugar(44.0)
  traits: genre-rock, year-1987

Gwen Stefani - Hollaback Girl
  audio: music/03 Hollaback Girl.mp3
  times: Bananas(158.0)
  traits: genre-pop, year-2005

House of Pain - Jump Around
  audio: music/01 Jump Around.mp3
  times: Donuts(47.7)
  traits: genre-hiphop, year-1992

Lou Bega - Mambo No. 5 (A Little Bit of...)
  audio: music/Mambo No. 5 (a Little Bit of...).mp3
  times: Trumpet(151.3)
  traits: genre-pop, year-1999
`;

const QUIZ_DEFAULT_POOL = quizParseList(QUIZ_DEFAULT_POOL_TEXT, QUIZ_DEFAULT_DETAILS_TEXT);

/* Out of the box the pages show the "Framo" board - the original quiz. The
   host can swap in a random board or another codeword at any time. */
const QUIZ_DEFAULT_BOARD = quizBuildBoard(QUIZ_DEFAULT_POOL, { preset: 'Framo' });
const QUIZ_DEFAULT_CATEGORIES = QUIZ_DEFAULT_BOARD.categories;
const QUIZ_DEFAULT_BONUS = QUIZ_DEFAULT_BOARD.bonus;

/* The list actually in play. quizApplyList() swaps it when the host builds a
   new board, so both windows can be re-pointed at a different quiz. */
let QUIZ_TITLE = QUIZ_DEFAULT_TITLE;
let QUIZ_CATEGORIES = QUIZ_DEFAULT_CATEGORIES;
let QUIZ_BONUS = QUIZ_DEFAULT_BONUS;
let QUIZ_ROWS = 0;

function quizApplyList(list) {
  const custom = list && list.categories && list.categories.length;
  QUIZ_TITLE = (list && list.title) || QUIZ_DEFAULT_TITLE;
  QUIZ_CATEGORIES = custom ? list.categories : QUIZ_DEFAULT_CATEGORIES;
  QUIZ_BONUS = custom ? (list.bonus || []) : QUIZ_DEFAULT_BONUS;
  QUIZ_ROWS = QUIZ_CATEGORIES.reduce(function (max, cat) { return Math.max(max, cat.clues.length); }, 0);
}

quizApplyList(null);

/* ---------- building a board out of the pool ----------

   The pool holds every song we own, grouped by category and marked with a
   difficulty 1-5. A board is five rows deep, so building one means picking one
   song per difficulty per category - either at random or from the lines
   carrying a preset codeword. */

/* Every codeword used anywhere in the pool, in the order it first appears. */
function quizPoolPresets(pool) {
  const found = [];
  const all = (pool && pool.categories || []).concat([{ clues: (pool && pool.bonus) || [] }]);
  all.forEach(function (cat) {
    (cat.clues || []).forEach(function (clue) {
      (clue.tags || []).forEach(function (tag) {
        const known = found.some(function (t) { return t.toLowerCase() === tag.toLowerCase(); });
        if (!known) found.push(tag);
      });
    });
  });
  return found;
}

function quizCluePlays(clue) {
  return quizNormalizeName(clue.artist) + ' | ' + quizNormalizeName(clue.song);
}

function quizShuffle(list, random) {
  const rnd = random || Math.random;
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const swap = out[i];
    out[i] = out[j];
    out[j] = swap;
  }
  return out;
}

/* The bonus round, drawn first from the categories the board did NOT use so it
   feels like fresh ground. A song already heard on the board may come back here
   under a DIFFERENT category - working out where else it turned up is half the
   fun - but never the same song in the same category, and never twice in one
   session. Takes one song per category before taking a second from any, so it
   does not all come out of one column. */
function quizPickBonus(pool, used, count, random, allowed, options) {
  const opts = options || {};
  const avoid = opts.avoidCategories || {};
  const taken = opts.taken || {};
  const rnd = random || Math.random;
  const chosen = [];

  function accept(clue, name) {
    const key = quizCluePlays(clue);
    if (taken[key] || used[key + ' | ' + name]) return false;
    taken[key] = true;
    used[key + ' | ' + name] = true;
    chosen.push(Object.assign({}, clue, { category: name }));
    return true;
  }

  // Categories no board can reach are dealt out by the caller before anything else.
  quizShuffle(opts.seed || [], rnd).forEach(function (item) {
    if (chosen.length < count) accept(item.clue, item.name);
  });

  const fresh = [];
  const rest = [];
  ((pool && pool.categories) || []).forEach(function (cat) {
    const left = (cat.clues || []).filter(function (clue) {
      return (!allowed || allowed(clue)) && !used[quizCluePlays(clue) + ' | ' + cat.name];
    });
    if (!left.length) return;
    (avoid[cat.name] ? rest : fresh).push({ name: cat.name, clues: quizShuffle(left, rnd) });
  });

  // Unused categories are drained first; the board's own are a fallback, not a ban.
  [fresh, rest].forEach(function (tier) {
    let round = quizShuffle(tier, rnd);
    while (chosen.length < count && round.length) {
      const next = [];
      for (let i = 0; i < round.length; i++) {
        const cat = round[i];
        while (chosen.length < count && cat.clues.length) {
          if (accept(cat.clues.shift(), cat.name)) break;
        }
        if (cat.clues.length) next.push(cat);
      }
      round = next;
    }
  });

  return chosen;
}

/* Require is "any of", not "all of": ticking rock and pop widens the pool
   rather than asking for songs that are somehow both. Exclude always wins. */
function quizTraitFilter(traits) {
  function lower(text) { return String(text).toLowerCase(); }
  const need = ((traits && traits.require) || []).map(lower);
  const drop = ((traits && traits.exclude) || []).map(lower);
  return function (clue) {
    const has = (clue.traits || []).map(lower);
    if (drop.some(function (t) { return has.indexOf(t) !== -1; })) return false;
    if (need.length && !need.some(function (t) { return has.indexOf(t) !== -1; })) return false;
    return true;
  };
}

/* Favouring is a nudge, never a filter: a preferred song comes up far more
   often, but an unloved one is still reachable, so a column always fills.
   An unrated song counts as a middling 3 and is left exactly where it was. */
function quizClueWeight(clue, favour) {
  if (!favour) return 1;
  let weight = 1;
  if (favour.fun !== false) weight += ((clue.fun || 3) - 3) * 0.5;
  const genres = (favour.genres || []).map(function (name) { return String(name).toLowerCase(); });
  if (genres.length && clue.genre && genres.indexOf(clue.genre) !== -1) weight += 1.5;
  const decades = (favour.decades || []).map(Number);
  if (decades.length && clue.year && decades.indexOf(Math.floor(clue.year / 10) * 10) !== -1) weight += 1.5;
  return Math.max(0.2, weight);
}

/* Every genre and decade the pool knows about, so the host console can offer
   them without any of them being configured up front. */
function quizPoolGenres(pool) {
  const found = [];
  quizPoolClues(pool).forEach(function (clue) {
    if (clue.genre && found.indexOf(clue.genre) === -1) found.push(clue.genre);
  });
  return found.sort(function (a, b) { return a.localeCompare(b); });
}

function quizPoolDecades(pool) {
  const found = [];
  quizPoolClues(pool).forEach(function (clue) {
    if (!clue.year) return;
    const decade = Math.floor(clue.year / 10) * 10;
    if (found.indexOf(decade) === -1) found.push(decade);
  });
  return found.sort(function (a, b) { return a - b; });
}

/* A song whose title gives an answer away may sit in two tiers: the lower one
   counts the title word, the higher one (clue.difficulty) does not. */
function quizClueTiers(clue) {
  return clue.titleTier ? [clue.titleTier, clue.difficulty] : [clue.difficulty];
}

function quizClueFits(clue, tier) {
  return quizClueTiers(clue).indexOf(tier) !== -1;
}

/* The clue as it plays in that tier. */
function quizClueAtTier(clue, tier) {
  if (!clue.titleTier || clue.titleTier !== tier) return clue;
  const easy = Object.assign({}, clue, { answer: clue.titleAnswer, difficulty: tier });
  delete easy.blocked;
  delete easy.titleTier;
  delete easy.titleAnswer;
  delete easy.titleTimed;
  if (clue.titleTimed) easy.timedAnswers = clue.titleTimed;
  else delete easy.timedAnswers;
  return easy;
}

function quizPoolClues(pool) {
  const all = ((pool && pool.categories) || []).concat([{ clues: (pool && pool.bonus) || [] }]);
  return all.reduce(function (list, cat) { return list.concat(cat.clues || []); }, []);
}

function quizBuildBoard(pool, options) {
  const opts = options || {};
  const rows = opts.rows || QUIZ_BOARD_ROWS;
  const columns = opts.columns || QUIZ_BOARD_COLUMNS;
  const wanted = opts.preset ? String(opts.preset).trim() : '';
  const preset = wanted.toLowerCase();
  const random = opts.random || Math.random;

  function pick(list) {
    if (!opts.favour) return list[Math.floor(random() * list.length)];
    const weights = list.map(function (clue) { return quizClueWeight(clue, opts.favour); });
    let total = 0;
    weights.forEach(function (weight) { total += weight; });
    let roll = random() * total;
    for (let i = 0; i < list.length; i++) {
      roll -= weights[i];
      if (roll <= 0) return list[i];
    }
    return list[list.length - 1];
  }

  function shuffled(list) {
    const out = list.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      const swap = out[i];
      out[i] = out[j];
      out[j] = swap;
    }
    return out;
  }

  function tagged(clue) {
    return (clue.tags || []).some(function (tag) { return tag.toLowerCase() === preset; });
  }

  const allowed = quizTraitFilter(opts.traits);

  // Songs an earlier board in the session took. Avoided where possible, never
  // banned: a repeated song beats a column with a hole in it.
  const spent = {};
  ((opts.exclude) || []).forEach(function (key) { spent[key] = true; });

  function fresh(clue) {
    return !spent[quizCluePlays(clue)];
  }

  function keep(clue) {
    return allowed(clue) && (!preset || tagged(clue));
  }

  const source = (pool && pool.categories) || [];
  let chosen = source.map(function (cat) {
    return { name: cat.name, clues: cat.clues.filter(keep) };
  }).filter(function (cat) { return cat.clues.length > 0; });

  if (!chosen.length) {
    if (opts.traits && ((opts.traits.require || []).length || (opts.traits.exclude || []).length)) {
      throw new Error('No songs are left once the trait filters are applied.');
    }
    throw new Error(preset ? 'No songs are tagged "' + wanted + '".' : 'The song pool is empty.');
  }

  if (!preset) {
    // A column is only clean if it can put a song in every row. Counting clues
    // lets through a category with six songs but none at difficulty 2, which
    // then silently fills that row with the wrong tier.
    const full = chosen.filter(function (cat) {
      for (let row = 1; row <= rows; row++) {
        const has = cat.clues.some(function (clue) { return quizClueFits(clue, row); });
        if (!has) return false;
      }
      return true;
    });
    const deep = chosen.filter(function (cat) { return cat.clues.length >= rows; });
    const draw = full.length >= columns ? full : (deep.length >= columns ? deep : chosen);
    // Categories already seen in this session sort last, so a second board
    // looks different from the first without ever failing to fill.
    const seen = opts.avoidCategories || {};
    const liked = ((opts.favour && opts.favour.categories) || [])
      .map(function (name) { return String(name).toLowerCase(); });
    const keep = quizShuffle(draw, random).sort(function (a, b) {
      const byLiked = (liked.indexOf(b.name.toLowerCase()) !== -1 ? 1 : 0) -
        (liked.indexOf(a.name.toLowerCase()) !== -1 ? 1 : 0);
      if (byLiked) return byLiked;
      const bySeen = (seen[a.name] || 0) - (seen[b.name] || 0);
      if (bySeen) return bySeen;
      return b.clues.filter(fresh).length - a.clues.filter(fresh).length;
    }).slice(0, columns);
    chosen = chosen.filter(function (cat) { return keep.indexOf(cat) !== -1; });
  }

  // Only this board's own picks. Repeating a song inside one board is still
  // forbidden; repeating one from an earlier board is merely discouraged.
  const used = {};

  function take(cat) {
    const left = cat.clues.slice();
    const clues = [];
    for (let row = 0; row < rows; row++) {
      const want = row + 1;
      const free = left.filter(function (clue) { return preset || !used[quizCluePlays(clue)]; });
      if (!free.length) break;

      let candidates = free.filter(function (clue) { return quizClueFits(clue, want); });
      // A codeword does not record which of its two tiers a song took, so a
      // one-tier song claims its row first and the two-tier one takes what is left.
      if (preset) {
        const exact = candidates.filter(function (clue) { return !clue.titleTier; });
        if (exact.length) candidates = exact;
      }
      const gap = function (clue) {
        return Math.min.apply(null, quizClueTiers(clue).map(function (tier) {
          return Math.abs((tier || want) - want);
        }));
      };
      if (!candidates.length) {
        // Nothing at this difficulty left - take the closest one instead.
        let closest = Infinity;
        free.forEach(function (clue) { closest = Math.min(closest, gap(clue)); });
        candidates = free.filter(function (clue) { return gap(clue) === closest; });
      }

      // Right tier first, unheard song second.
      const unheard = candidates.filter(fresh);
      const clue = pick(unheard.length ? unheard : candidates);
      used[quizCluePlays(clue)] = true;
      left.splice(left.indexOf(clue), 1);
      clues.push(quizClueAtTier(clue, want));
    }
    return { name: cat.name, clues: clues };
  }

  const categories = [];
  // Thin categories pick first, so the shared "no song twice" rule cannot
  // leave one of them with an unfillable column.
  const order = chosen.slice().sort(function (a, b) { return a.clues.length - b.clues.length; });
  order.forEach(function (cat) { categories[chosen.indexOf(cat)] = take(cat); });

  const board = categories.filter(function (cat) { return cat && cat.clues.length > 0; });

  // Where each song actually landed. The bonus round may reuse a song under a
  // different category, so the pair matters, not the song on its own.
  board.forEach(function (cat) {
    cat.clues.forEach(function (clue) { used[quizCluePlays(clue) + ' | ' + cat.name] = true; });
  });

  const bonusCount = opts.bonusCount === undefined ? QUIZ_BONUS_COUNT : opts.bonusCount;
  const bonusPool = ((pool && pool.bonus) || []).filter(allowed);
  let bonus;
  if (bonusPool.length) {
    bonus = preset ? bonusPool.filter(tagged) : shuffled(bonusPool).slice(0, columns);
    if (!bonus.length) bonus = bonusPool.slice(0, columns);
    bonus.forEach(function (clue) { used[quizCluePlays(clue)] = true; });
  } else if (bonusCount > 0) {
    const avoidCategories = {};
    board.forEach(function (cat) { avoidCategories[cat.name] = true; });
    bonus = quizPickBonus(pool, used, bonusCount, random, allowed, { avoidCategories: avoidCategories });
  } else {
    // A session draws its own bonus rounds once every board is settled.
    bonus = [];
  }

  return {
    title: (pool && pool.title) || QUIZ_DEFAULT_TITLE,
    preset: wanted,
    categories: board,
    bonus: bonus,
    used: Object.keys(used)
  };
}

/* A session is several boards played in one evening, each followed by its own
   bonus round. Nothing is repeated anywhere in it: every board is built from
   what the earlier ones left, and categories already used sort to the back so
   consecutive boards do not look the same. */
function quizBuildSession(pool, options) {
  const opts = options || {};
  const random = opts.random || Math.random;
  const count = opts.boards || QUIZ_SESSION_BOARDS;
  const presets = opts.presets || [];
  const used = {};
  const seen = {};
  const boards = [];

  for (let i = 0; i < count; i++) {
    const built = quizBuildBoard(pool, {
      preset: presets[i] || '',
      traits: opts.traits,
      favour: opts.favour,
      random: random,
      exclude: Object.keys(used),
      avoidCategories: seen,
      bonusCount: 0
    });
    built.used.forEach(function (key) { used[key] = true; });
    built.categories.forEach(function (cat) { seen[cat.name] = (seen[cat.name] || 0) + 1; });
    boards.push(built);
  }

  /* Bonus rounds come last, once every board is settled. Drawing them as each
     board is built lets a song taken for board one's bonus still turn up on
     board three, which a preset board would not have excluded. */
  const size = opts.bonusCount === undefined ? QUIZ_BONUS_COUNT : opts.bonusCount;
  const allowed = quizTraitFilter(opts.traits);
  const bonusTaken = {};

  /* Categories no board could fill are the freshest thing the evening has left,
     so they are dealt evenly across the rounds before anything tops a round up. */
  const spare = [];
  ((pool && pool.categories) || []).forEach(function (cat) {
    if (seen[cat.name]) return;
    (cat.clues || []).filter(allowed).forEach(function (clue) {
      spare.push({ clue: clue, name: cat.name });
    });
  });
  const shares = boards.map(function () { return []; });
  quizShuffle(spare, random).forEach(function (item, i) {
    shares[i % boards.length].push(item);
  });

  boards.forEach(function (board, i) {
    if (board.bonus && board.bonus.length) return; // an authored BONUS: section wins
    const avoidCategories = {};
    board.categories.forEach(function (cat) { avoidCategories[cat.name] = true; });
    board.bonus = quizPickBonus(pool, used, size, random, allowed, {
      avoidCategories: avoidCategories,
      taken: bonusTaken,
      seed: shares[i]
    });
    board.used = board.used.concat(board.bonus.map(quizCluePlays));
  });

  return {
    title: (pool && pool.title) || QUIZ_DEFAULT_TITLE,
    boards: boards
  };
}

/* The key that ties a line in "quiz list.txt" to a block in "song details.txt".
   Deliberately not quizNormalizeName(), which throws away bracketed asides and
   words like "feat" - useful for matching filenames, wrong for identity, since
   it would fuse "Pretty Fly (For a White Guy)" with any other "Pretty Fly". */
function quizDetailKey(text) {
  return String(text)
    .toLowerCase()
    .replace(/ø/g, 'o')
    .replace(/æ/g, 'ae')
    .replace(/å/g, 'a')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/* Splits an answer on commas and slashes, but never inside parentheses, so
   "(Manhattan, Miami), Paris" stays two terms rather than three. */
function quizAnswerTerms(answer) {
  const terms = [];
  let buf = '';
  let depth = 0;
  String(answer || '').split('').forEach(function (char) {
    if (char === '(') depth++;
    else if (char === ')') depth = Math.max(0, depth - 1);
    if ((char === ',' || char === '/') && !depth) {
      terms.push(buf.trim());
      buf = '';
      return;
    }
    buf += char;
  });
  terms.push(buf.trim());
  return terms.filter(function (term) { return term.length > 0; });
}

/* A "clue:" value, e.g. "Food @45 +Framo": the category it belongs to, then
   the same trailing tokens a list line would carry. */
function quizParseClueExtras(value) {
  const presets = [];
  let start = 0;
  const category = String(value)
    .replace(/\s*(?:@\s*(\d+(?:\.\d+)?)|\+([A-Za-z0-9_-]+))/g, function (match, at, tag) {
      if (at !== undefined) start = Number(at);
      else presets.push(tag);
      return '';
    })
    .trim();
  return { category: category, start: start, presets: presets };
}

/* Genre, year and the entertainment rating ride inside "traits:" as prefixed
   values, so neither text file grows a new key and both parsers stay as they
   are. Splits them back out; anything unprefixed stays an ordinary trait. */
function quizSplitTraits(list) {
  const out = { traits: [], genre: '', year: 0, fun: 0 };
  (list || []).forEach(function (trait) {
    const lower = String(trait).trim().toLowerCase();
    if (lower.indexOf('genre-') === 0) out.genre = lower.slice(6);
    else if (lower.indexOf('year-') === 0) out.year = Number(lower.slice(5)) || 0;
    else if (lower.indexOf('fun-') === 0) out.fun = Number(lower.slice(4)) || 0;
    else if (lower) out.traits.push(String(trait).trim());
  });
  return out;
}

/* The inverse, for writing a song block back out. */
function quizJoinTraits(song) {
  const parts = (song.traits || []).slice();
  if (song.genre) parts.push('genre-' + song.genre);
  if (song.year) parts.push('year-' + song.year);
  return parts.join(', ');
}

/* The entertainment rating rides as a preset codeword so it can belong to one
   clue rather than to the song in every category it appears in. A "fun-N"
   trait is still read as the song's default until the clue carries its own.
   The pattern is inline: the built-in pool is parsed further up this file, so
   a const declared here would still be in its dead zone. */
function quizSplitFunTag(clue) {
  const kept = [];
  (clue.tags || []).forEach(function (tag) {
    const rated = /^fun([1-5])$/i.exec(tag);
    if (rated) clue.fun = Number(rated[1]);
    else kept.push(tag);
  });
  if (kept.length) clue.tags = kept;
  else delete clue.tags;
}

/* Text format, see "song details.txt". One block per song:

     Eminem - Lose Yourself
       audio: music/06 Lose Yourself.mp3
       times: Spaghetti(58.8)
       traits: rap, english
       clue: Food +Framo

   Everything but "clue:" belongs to the song wherever it appears. Returns a
   lookup keyed by quizDetailKey("Artist - Song"). */
function quizParseDetails(text) {
  const lines = String(text || '').replace(/\r/g, '').split('\n');
  const songs = {};
  let current = null;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();
    if (!line || line.charAt(0) === '#') continue;

    if (!/^\s/.test(raw)) {
      if (line.indexOf(' - ') === -1) {
        throw new Error('Details line ' + (i + 1) + ': expected "Artist - Song".');
      }
      current = { name: line, audio: '', times: [], traits: [], clues: [], trivia: [] };
      songs[quizDetailKey(line)] = current;
      continue;
    }

    if (!current) throw new Error('Details line ' + (i + 1) + ': a detail before any song.');
    const colon = line.indexOf(':');
    if (colon === -1) throw new Error('Details line ' + (i + 1) + ': expected "key: value".');

    const key = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();

    if (key === 'audio') {
      current.audio = value;
    } else if (key === 'times') {
      const timed = /([^,]+?)\s*\((\d+(?:\.\d+)?)\)/g;
      let found = timed.exec(value);
      while (found) {
        current.times.push({ text: found[1].trim(), after: Number(found[2]) });
        found = timed.exec(value);
      }
    } else if (key === 'traits') {
      value.split(',').forEach(function (trait) {
        if (trait.trim()) current.traits.push(trait.trim());
      });
    } else if (key === 'clue') {
      current.clues.push(value);
    } else if (key === 'trivia') {
      const eq = value.indexOf(' = ');
      if (eq === -1) throw new Error('Details line ' + (i + 1) + ': expected "trivia: Category | Question = Answer".');
      let question = value.slice(0, eq).trim();
      let category = '';
      const bar = question.indexOf('|');
      if (bar !== -1) {
        category = question.slice(0, bar).trim();
        question = question.slice(bar + 1).trim();
      }
      current.trivia.push({ category: category, question: question, answer: value.slice(eq + 3).trim() });
    } else {
      throw new Error('Details line ' + (i + 1) + ': unknown key "' + key +
        '". Expected audio, times, traits, clue or trivia.');
    }
  }

  Object.keys(songs).forEach(function (key) {
    const song = songs[key];
    const split = quizSplitTraits(song.traits);
    song.traits = split.traits;
    song.genre = split.genre;
    song.year = split.year;
    song.fun = split.fun;
  });

  return songs;
}

/* Decorates an already parsed pool with its details. A line in the list always
   wins, so an old single-file list keeps working untouched. */
function quizApplyDetails(pool, songs) {
  if (!songs) return pool;

  const groups = (pool.categories || []).concat([{ name: 'BONUS', clues: pool.bonus || [] }]);

  groups.forEach(function (cat) {
    (cat.clues || []).forEach(function (clue) {
      const song = songs[quizDetailKey(clue.artist + ' - ' + clue.song)];
      if (!song) return;

      if (song.audio && !clue.audio) clue.audio = song.audio;
      if (song.traits.length) clue.traits = song.traits.slice();
      if (song.genre) clue.genre = song.genre;
      if (song.year) clue.year = song.year;
      if (song.fun) clue.fun = song.fun;
      // A question naming a category beats one that fits anywhere.
      const trivia = song.trivia.filter(function (t) { return quizDetailKey(t.category) === quizDetailKey(cat.name); })[0] ||
        song.trivia.filter(function (t) { return !t.category; })[0];
      if (trivia) clue.trivia = { question: trivia.question, answer: trivia.answer };

      // Times are held per word for the whole song, so take only the words
      // this particular clue asks for.
      const addTimes = function (timed, answer) {
        quizAnswerTerms(answer).forEach(function (term) {
          song.times.forEach(function (time) {
            if (quizDetailKey(time.text) !== quizDetailKey(term)) return;
            const already = timed.some(function (t) { return t.text === term; });
            if (!already) timed.push({ text: term, after: time.after });
          });
        });
        return timed;
      };
      const titled = clue.titleTier ? addTimes((clue.timedAnswers || []).slice(), clue.titleAnswer) : null;
      const timed = addTimes(clue.timedAnswers || [], clue.answer);
      if (timed.length) clue.timedAnswers = timed;
      if (titled && titled.length) clue.titleTimed = titled;

      song.clues.forEach(function (entry) {
        const extras = quizParseClueExtras(entry);
        if (quizDetailKey(extras.category) !== quizDetailKey(cat.name)) return;
        if (extras.start && !clue.start) clue.start = extras.start;
        if (extras.presets.length) clue.tags = (clue.tags || []).concat(extras.presets);
      });
    });
  });

  return pool;
}

/* Every trait used anywhere in the pool, so the host console can offer them
   as filters without any of them being configured up front. */
function quizPoolTraits(pool) {
  const found = [];
  const all = (pool && pool.categories || []).concat([{ clues: (pool && pool.bonus) || [] }]);
  all.forEach(function (cat) {
    (cat.clues || []).forEach(function (clue) {
      (clue.traits || []).forEach(function (trait) {
        const known = found.some(function (t) { return t.toLowerCase() === trait.toLowerCase(); });
        if (!known) found.push(trait);
      });
    });
  });
  return found.sort(function (a, b) { return a.localeCompare(b); });
}

/* Text format, see "quiz list.txt":

     Title: Musikk Quiz          optional, anywhere in the file
     Food:                       a line ending in ":" starts a category
     Eminem - Lose Yourself = Spaghetti #1
     BONUS:                      reserved name for the off-board round
     Food | ZZ Top - Burger Man = Burger

   The audio file, the timing of each word, the traits and the preset codewords
   all live in "song details.txt" now, keyed by "Artist - Song". Pass its text
   as the second argument.

   Trailing tokens on a clue line are still read, so a pre-split single-file
   list parses unchanged: "#3" difficulty, "@45" clip start, "+Framo" preset
   codeword, "!path" audio file (that one comes last). An answer word with a
   leading "-" is one the song title gives away, so it is not accepted. Blank
   lines and lines starting with "#" are ignored. A clue without "#" takes its
   position in the category as its difficulty. */
function quizParseList(text, detailsText) {
  const lines = String(text).replace(/\r/g, '').split('\n');
  const categories = [];
  const bonus = [];
  let title = '';
  let current = null;
  let inBonus = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.charAt(0) === '#') continue;

    const titled = /^title\s*:\s*(.+)$/i.exec(line);
    if (titled) {
      title = titled[1].trim();
      continue;
    }

    if (line.charAt(line.length - 1) === ':') {
      const name = line.slice(0, -1).trim();
      inBonus = /^bonus$/i.test(name);
      current = null;
      if (!inBonus) {
        if (!name) throw new Error('Line ' + (i + 1) + ': the category has no name.');
        current = { name: name, clues: [] };
        categories.push(current);
      }
      continue;
    }

    const eq = line.indexOf('=');
    if (eq === -1) throw new Error('Line ' + (i + 1) + ': expected "Artist - Song = Answer".');

    let left = line.slice(0, eq).trim();
    let answer = line.slice(eq + 1).trim();

    let audio = '';
    const bang = /\s!\s*(\S.*)$/.exec(answer);
    if (bang) {
      audio = bang[1].trim();
      answer = answer.slice(0, bang.index).trim();
    }

    let start = 0;
    let difficulty = 0;
    let tierPair = null;
    const tags = [];
    let token = QUIZ_LINE_TOKEN.exec(answer);
    while (token) {
      if (token[1] !== undefined) start = Number(token[1]);
      else if (token[2] !== undefined) {
        const tiers = token[2].split('/').map(Number);
        difficulty = tiers[0];
        tierPair = tiers.length === 2 ? tiers : null;
      } else tags.unshift(token[3]);
      answer = answer.slice(0, token.index).trim();
      token = QUIZ_LINE_TOKEN.exec(answer);
    }

    const timedAnswers = [];
    answer = answer.replace(/(^|[,/])\s*([^,/]+?)\s*\((\d+(?:\.\d+)?)\)(?=\s*(?:[,/]|$))/g,
      function (match, separator, text, seconds) {
        timedAnswers.push({ text: text.trim(), after: Number(seconds) });
        return separator + ' ' + text.trim();
      }).trim();

    // A word written "-Black" is in the song title, so it is not an answer.
    const blocked = [];
    let titleAnswer = answer;
    if (/(^|[,/])\s*-/.test(answer)) {
      const parts = answer.split(/\s*([,/])\s*/);
      const kept = [];
      const whole = [];
      for (let p = 0; p < parts.length; p += 2) {
        const dashed = /^-\s*(\S.*)$/.exec(parts[p]);
        if (dashed) blocked.push(dashed[1].trim());
        else if (parts[p]) kept.push({ text: parts[p], sep: parts[p + 1] || ',' });
        if (parts[p]) whole.push({ text: dashed ? dashed[1].trim() : parts[p], sep: parts[p + 1] || ',' });
      }
      const join = function (list) {
        return list.map(function (k, index) {
          return k.text + (index < list.length - 1 ? k.sep + ' ' : '');
        }).join('').trim();
      };
      answer = join(kept);
      titleAnswer = join(whole);
    }

    // "#1/3": the lower tier counts the title word, the higher one does not.
    if (tierPair) {
      if (tierPair[0] === tierPair[1] || !blocked.length || !answer) {
        throw new Error('Line ' + (i + 1) + ': two tiers like "#1/3" need a "-Word" from the title, ' +
          'at least one other answer, and two different tiers.');
      }
      difficulty = Math.max(tierPair[0], tierPair[1]);
    }

    let bonusCategory = '';
    const pipe = left.indexOf('|');
    if (pipe !== -1) {
      bonusCategory = left.slice(0, pipe).trim();
      left = left.slice(pipe + 1).trim();
    }

    const dash = left.indexOf(' - ');
    if (dash === -1) throw new Error('Line ' + (i + 1) + ': expected "Artist - Song" before the "=".');

    const clue = {
      song: left.slice(dash + 3).trim(),
      artist: left.slice(0, dash).trim(),
      answer: answer
    };
    if (start) clue.start = start;
    if (audio) clue.audio = audio;
    if (tags.length) clue.tags = tags;
    if (blocked.length) clue.blocked = blocked;
    if (tierPair) {
      clue.titleTier = Math.min(tierPair[0], tierPair[1]);
      clue.titleAnswer = titleAnswer;
    }
    if (timedAnswers.length) clue.timedAnswers = timedAnswers;

    if (inBonus) {
      clue.category = bonusCategory;
      clue.difficulty = difficulty || bonus.length + 1;
      bonus.push(clue);
    } else {
      if (!current) throw new Error('Line ' + (i + 1) + ': start a category first, e.g. "Food:".');
      clue.difficulty = difficulty || current.clues.length + 1;
      current.clues.push(clue);
    }
  }

  if (!categories.length) throw new Error('No categories found - a category is a line ending in ":".');
  const pool = { title: title || QUIZ_DEFAULT_TITLE, categories: categories, bonus: bonus };
  const whole = quizApplyDetails(pool, detailsText ? quizParseDetails(detailsText) : null);
  quizPoolClues(whole).forEach(quizSplitFunTag);
  return whole;
}

function quizClue(catIndex, rowIndex) {
  const cat = QUIZ_CATEGORIES[catIndex];
  return cat ? cat.clues[rowIndex] || null : null;
}

function quizTileKey(catIndex, rowIndex) {
  return catIndex + '-' + rowIndex;
}

function quizBonusKey(index) {
  return 'bonus-' + index;
}

function quizPoints(rowIndex) {
  return rowIndex + 1;
}

/* House rule: 10 sec of playback for the two cheapest rows, 20 sec above. */
function quizSeconds(rowIndex) {
  return rowIndex < 2 ? 10 : 20;
}

/* Audio files live next to these pages in a "music" folder and are matched by
   "<Category> <points>.mp3" unless a clue sets its own "audio" path.
   Add "start: 42" to a clue to drop the needle 42 seconds in. */
function quizDefaultAudioSrc(clue, defaults) {
  const song = quizNormalizeName(clue.song);
  const artist = quizNormalizeName(clue.artist);
  for (let i = 0; i < defaults.length; i++) {
    if (quizNormalizeName(defaults[i].song) === song && quizNormalizeName(defaults[i].artist) === artist) {
      return defaults[i].audio || null;
    }
  }
  return null;
}

function quizAudioSrc(catIndex, rowIndex) {
  const clue = quizClue(catIndex, rowIndex);
  if (!clue || clue.audio === null) return null;
  if (clue.audio) return clue.audio;
  const defaultClues = QUIZ_DEFAULT_POOL.categories.reduce(function (all, category) { return all.concat(category.clues); }, []);
  const defaultSrc = quizDefaultAudioSrc(clue, defaultClues);
  if (defaultSrc) return defaultSrc;
  return 'music/' + QUIZ_CATEGORIES[catIndex].name + ' ' + quizPoints(rowIndex) + '.mp3';
}

function quizAudioStart(catIndex, rowIndex) {
  const clue = quizClue(catIndex, rowIndex);
  return clue && clue.start ? clue.start : 0;
}

/* Bonus songs fall back to "music/Bonus 1.mp3", "music/Bonus 2.mp3", ... */
function quizBonusAudioSrc(index) {
  const clue = QUIZ_BONUS[index];
  if (!clue || clue.audio === null) return null;
  if (clue.audio) return clue.audio;
  const defaultSrc = quizDefaultAudioSrc(clue, QUIZ_DEFAULT_POOL.bonus);
  if (defaultSrc) return defaultSrc;
  return 'music/Bonus ' + (index + 1) + '.mp3';
}

function quizBonusAudioStart(index) {
  const clue = QUIZ_BONUS[index];
  return clue && clue.start ? clue.start : 0;
}

/* ---------- the example round ----------

   "Blue (Da Ba Dee)" is deliberately not on the board and not in the bonus
   list. It is a throwaway tile the host can play exactly like a real one -
   countdown, timed answer, wrong answers, free-for-all, points - on its own
   pretend scoreboard. Nothing in here reads or writes the real tiles, teams
   or bonus round, so it costs the game nothing. */

const QUIZ_DEMO_KEY = 'demo';

const QUIZ_DEMO_CLUE = {
  category: 'Colour',
  song: 'Blue (Da Ba Dee)',
  artist: 'Eiffel 65',
  answer: 'Blue',
  points: 1,
  seconds: 10,
  timedAnswers: [{ text: 'Blue', after: 7.5 }],
  audio: 'music/Eiffel 65 - Blue.mp3',
  trivia: { question: 'How many times is "blue" said in the song?', answer: '36' }
};

function quizDemoAudioSrc() {
  return QUIZ_DEMO_CLUE.audio;
}

function quizDemoFreshTile() {
  return { wrong: 0, done: false, awardedTo: null, revealedAnswers: {} };
}

/* Real names where we have them, so the room recognises itself, but two
   pretend teams only: one miss to show red, the next to show green. */
function quizDemoFreshState(names) {
  const list = names || [];
  return {
    names: [list[0] || 'Team 1', list[1] || 'Team 2'],
    scores: [0, 0],
    tile: quizDemoFreshTile(),
    open: false,
    reveal: null,
    trivia: null,
    triviaDone: false
  };
}

/* { shown, result } while the example's trivia question is up; result is
   { team } once settled, team null for nobody. */
function quizDemoTrivia(state) {
  return quizDemoOpen(state) && state.demo.trivia ? state.demo.trivia : null;
}

/* The example's own answer screen: { team, songTo, artistTo, head } with team
   indexes, same rules as quizReveal() on the real board. */
function quizDemoReveal(state) {
  return quizDemoOpen(state) && state.demo.reveal ? state.demo.reveal : null;
}

function quizDemoActive(state) {
  return !!(state && state.demo);
}

function quizDemoOpen(state) {
  return quizDemoActive(state) && !!state.demo.open;
}

function quizDemoTile(state) {
  if (!quizDemoActive(state)) return quizDemoFreshTile();
  if (!state.demo.tile) state.demo.tile = quizDemoFreshTile();
  if (!state.demo.tile.revealedAnswers) state.demo.tile.revealedAnswers = {};
  return state.demo.tile;
}

function quizDemoTeams(state) {
  if (!quizDemoActive(state)) return [];
  const names = state.demo.names || [];
  const scores = state.demo.scores || [];
  return names.map(function (name, i) {
    return { id: 'demo-' + i, index: i, name: name, score: scores[i] || 0 };
  });
}

function quizDemoIsOpenToAll(state) {
  const tile = quizDemoTile(state);
  const teamCount = quizDemoTeams(state).length || 1;
  return !tile.done && tile.wrong >= teamCount;
}

/* The answer word that pops up part way through the clip, kept once shown so
   it survives the countdown running out. */
function quizDemoRevealed(state, elapsed) {
  const tile = quizDemoTile(state);
  const shown = [];
  let changed = false;
  QUIZ_DEMO_CLUE.timedAnswers.forEach(function (answer, index) {
    const key = String(index);
    if (!tile.revealedAnswers[key] && elapsed >= answer.after) {
      tile.revealedAnswers[key] = true;
      changed = true;
    }
    if (tile.revealedAnswers[key]) shown.push(answer.text);
  });
  return { texts: shown, changed: changed };
}


const QUIZ_AUDIO_EXT = /\.(mp3|m4a|aac|ogg|oga|opus|wav|flac|webm)$/i;

/* Strips the noise that download tools add so "Billy Joel - We Didn't Start
   the Fire (Official HD Video)" can be matched against the clue list. */
function quizNormalizeName(text) {
  return String(text)
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/ø/g, 'o')
    .replace(/æ/g, 'ae')
    .replace(/å/g, 'a')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/\b(official|video|audio|lyrics?|hd|hq|4k|remastered|remaster|music|full|version|feat|ft|topic)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/* Matches a folder of audio files to the board. One file may serve two clues,
   which is what "That's Amore" needs. */
function quizMatchAudioFiles(files) {
  const entries = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!QUIZ_AUDIO_EXT.test(file.name)) continue;
    entries.push({ file: file, norm: quizNormalizeName(file.name.replace(QUIZ_AUDIO_EXT, '')) });
  }

  const matches = {};

  function matchClue(clue, key) {
    const song = quizNormalizeName(clue.song);
    const artist = quizNormalizeName(clue.artist);
    let best = null;
    let bestScore = 0;

    entries.forEach(function (entry) {
      let score = 0;
      if (song && entry.norm.indexOf(song) !== -1) score += 2;
      if (artist && entry.norm.indexOf(artist) !== -1) score += 1;
      // A short title like "Kids" is only trusted when the artist matches too.
      if (score < 2 || (song.length < 5 && score < 3)) return;
      if (score > bestScore || (score === bestScore && best && entry.norm.length < best.norm.length)) {
        best = entry;
        bestScore = score;
      }
    });

    if (best) matches[key] = best.file;
  }

  QUIZ_CATEGORIES.forEach(function (cat, catIndex) {
    cat.clues.forEach(function (clue, rowIndex) {
      matchClue(clue, quizTileKey(catIndex, rowIndex));
    });
  });

  QUIZ_BONUS.forEach(function (clue, index) {
    matchClue(clue, quizBonusKey(index));
  });

  matchClue(QUIZ_DEMO_CLUE, QUIZ_DEMO_KEY);

  return { matches: matches, audioFileCount: entries.length };
}

/* Spotify copy: the main quiz measured its mp3 files to even out loudness;
   Spotify levels its own songs, so this keeps the same shape and does nothing. */
function quizCreateVolumeLeveler() {
  return {
    prepare: async function () { return 1; },
    preload: async function () {},
    setEnabled: function () {}
  };
}

// Spotify copy: own names so it never shares saved games or the board link with the main quiz.
const QUIZ_STORAGE_KEY = 'musikkQuizSpotify_state';
const QUIZ_PING_PREFIX = 'musikkQuizSpotify_ping_';
const QUIZ_CHANNEL_NAME = 'musikkQuizSpotify';

function quizDefaultState() {
  return {
    rev: 0,
    started: false,
    teams: [
      { id: 't1', name: 'Team 1', score: 0 },
      { id: 't2', name: 'Team 2', score: 0 }
    ],
    tiles: {},
    selected: null,
    timer: null,
    guess: null,
    reveal: null,
    answerPlaying: null,
    competitive: { on: false, seconds: 15 },
    freeForAll: { on: false, full: false, extend: 10 },
    list: null,
    boardNo: 0,
    named: {},
    trivia: null,
    triviaAsked: {},
    demo: null,
    bonus: { open: null, points: 2, done: {} },
    audio: { where: 'console', src: null, token: 0, start: 0, duration: 0, playing: false, normalize: true }
  };
}

/* The bonus round runs after the board is empty: standalone songs that play
   in full until the host pauses them, and the host sets what they are worth. */
function quizBonusOpen(state) {
  const bonus = state.bonus;
  return bonus && typeof bonus.open === 'number' ? bonus.open : null;
}

function quizBonusPoints(state) {
  const bonus = state.bonus;
  return bonus && typeof bonus.points === 'number' ? bonus.points : 2;
}

function quizBonusResult(state, index) {
  const bonus = state.bonus;
  return (bonus && bonus.done && bonus.done[String(index)]) || null;
}

function quizTile(state, catIndex, rowIndex) {
  const tiles = state.tiles || {};
  return tiles[quizTileKey(catIndex, rowIndex)] || { wrong: 0, done: false, awardedTo: null };
}

function quizTimerLeft(timer) {
  if (!timer) return 0;
  return timer.running ? Math.max(0, (timer.endsAt - Date.now()) / 1000) : Math.max(0, timer.remaining);
}

function quizNewTimer(seconds) {
  return { duration: seconds, remaining: seconds, endsAt: Date.now() + seconds * 1000, running: true };
}

/* The answer screen: winning the category does not clear the tile, it turns it
   over. The accepted answers come out in full, the song title and the artist
   stay as dashes until somebody names them. */
const QUIZ_HEAD_START_SECONDS = 5;

function quizReveal(state) {
  const reveal = state && state.reveal;
  return reveal && typeof reveal.cat === 'number' ? reveal : null;
}

function quizRevealOpen(state, catIndex, rowIndex) {
  const reveal = quizReveal(state);
  return !!reveal && reveal.cat === catIndex && reveal.row === rowIndex;
}

/* A short head start for the team that won the category, then the room joins in. */
function quizHeadTimer(state) {
  const reveal = quizReveal(state);
  return reveal && reveal.head ? reveal.head : null;
}

function quizHeadStartOver(state) {
  const head = quizHeadTimer(state);
  return !head || quizTimerLeft(head) <= 0;
}

/* +S / +A are earned once per song per session: when the same song comes back
   on a later tile, a title or artist already named is not worth a point again. */
function quizNamedAt(state, catIndex, rowIndex) {
  return (state.boardNo || 0) + ':' + quizTileKey(catIndex, rowIndex);
}

function quizRecordNamed(state, clue, which, teamId, catIndex, rowIndex) {
  if (!state.named) state.named = {};
  const key = quizCluePlays(clue);
  const record = state.named[key] || (state.named[key] = {});
  if (!record[which]) record[which] = { team: teamId, at: quizNamedAt(state, catIndex, rowIndex) };
}

/* Trivia: a follow-up question on a tile a team has won. The tile stays open
   and turns white; free for all, fixed points, asked once - tile.trivia records
   the result and state.trivia.shown whether the question is up yet. */
const QUIZ_TRIVIA_POINTS = 2;

function quizTriviaKey(clue) {
  return quizCluePlays(clue) + ' | ' + clue.trivia.question;
}

function quizTriviaAvailable(state, catIndex, rowIndex) {
  const clue = quizClue(catIndex, rowIndex);
  const tile = quizTile(state, catIndex, rowIndex);
  if (!clue || !clue.trivia || tile.trivia) return false;
  // The same question coming back on a later board is not asked twice.
  return !(state.triviaAsked || {})[quizTriviaKey(clue)];
}

function quizTriviaOpen(state) {
  const trivia = state && state.trivia;
  return trivia && typeof trivia.cat === 'number' ? trivia : null;
}

function quizNamedEarlier(state, clue, which, catIndex, rowIndex) {
  const record = state && state.named && clue ? state.named[quizCluePlays(clue)] : null;
  const hit = record && record[which];
  return hit && hit.at !== quizNamedAt(state, catIndex, rowIndex) ? hit : null;
}

/* A blank the room fills in, not a hint: one mark whatever the title is. */
function quizMaskText() {
  return '_';
}

/* Competitive mode: when the clip runs out a second countdown starts for the
   answers. It never closes the tile - the host still hands out the points. */
function quizCompetitive(state) {
  if (!state.competitive || typeof state.competitive !== 'object') state.competitive = { on: false, seconds: 15 };
  if (typeof state.competitive.seconds !== 'number') state.competitive.seconds = 15;
  return state.competitive;
}

/* Free-for-all mode: nobody takes turns. Either every re-open of a tile plays a
   longer stretch of the song, or the song simply runs until the host stops it. */
function quizFreeForAll(state) {
  if (!state.freeForAll || typeof state.freeForAll !== 'object') state.freeForAll = { on: false, full: false, extend: 10 };
  if (typeof state.freeForAll.extend !== 'number') state.freeForAll.extend = 10;
  state.freeForAll.full = !!state.freeForAll.full;
  return state.freeForAll;
}

/* How long the clip should run for this open. null means "no countdown". */
function quizListenSeconds(state, catIndex, rowIndex, opens) {
  const free = quizFreeForAll(state);
  if (!free.on) return quizSeconds(rowIndex);
  if (free.full) return null;
  const times = typeof opens === 'number' ? opens : (quizTile(state, catIndex, rowIndex).opens || 0);
  return quizSeconds(rowIndex) + free.extend * Math.max(0, times);
}

/* The guessing clock only means anything while a clip countdown is around, so
   closing a tile or opening it to the room drops it with state.timer. */
function quizGuessTimer(state) {
  return state && state.timer && state.guess ? state.guess : null;
}

/* Once every team has had a shot and missed, the tile opens up to the room. */
function quizIsOpenToAll(state, catIndex, rowIndex) {
  const tile = quizTile(state, catIndex, rowIndex);
  const teamCount = (state.teams || []).length || 1;
  return !tile.done && tile.wrong >= teamCount;
}

/* Only the host console writes state; the board reads and mirrors it.

   The primary link is a direct window reference (opener <-> opened) with
   postMessage, because that is the one channel that works in every browser
   when the pages are opened from file://. Firefox in particular does not
   reliably share localStorage or BroadcastChannel between file:// windows.
   localStorage is still used as a fallback and to survive a reload. */
const QuizSync = (function () {
  const listeners = [];
  let lastRev = -1;
  let latest = null;
  let channel = null;
  let partner = null;
  let partnerSeen = 0;
  let myRole = null;

  try {
    channel = new BroadcastChannel(QUIZ_CHANNEL_NAME);
  } catch (err) {
    channel = null;
  }

  try {
    if (window.opener && !window.opener.closed) partner = window.opener;
  } catch (err) {
    partner = null;
  }

  function read() {
    try {
      const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (err) {
      return null;
    }
  }

  function store(state) {
    try {
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      /* storage may be unavailable; the window link still delivers */
    }
  }

  function emit(state) {
    listeners.forEach(function (fn) {
      try {
        fn(state);
      } catch (err) {
        /* one broken listener must not stop the others */
      }
    });
  }

  function accept(state) {
    if (!state || typeof state.rev !== 'number' || state.rev === lastRev) return;
    lastRev = state.rev;
    latest = state;
    store(state);
    emit(state);
  }

  function post(message) {
    if (!partner) return;
    try {
      if (partner.closed) {
        partner = null;
        return;
      }
      message.__quiz = QUIZ_CHANNEL_NAME;
      partner.postMessage(message, '*');
    } catch (err) {
      /* the other window went away */
    }
  }

  function write(state) {
    state.rev = (state.rev || 0) + 1;
    lastRev = state.rev;
    latest = state;
    store(state);
    if (channel) {
      try {
        channel.postMessage(state);
      } catch (err) {
        /* ignore */
      }
    }
    post({ type: 'state', state: state });
    emit(state);
    return state;
  }

  window.addEventListener('message', function (event) {
    const data = event.data;
    if (!data || data.__quiz !== QUIZ_CHANNEL_NAME) return;

    if (!partner || partner.closed) partner = event.source;
    partnerSeen = Date.now();

    if (data.type === 'state') {
      accept(data.state);
    } else if (data.type === 'hello') {
      const current = latest || read();
      if (current) post({ type: 'state', state: current });
      post({ type: 'ping' });
    }
  });

  if (channel) {
    channel.onmessage = function (event) {
      accept(event.data);
    };
  }

  window.addEventListener('storage', function (event) {
    if (event.key === QUIZ_STORAGE_KEY) accept(read());
  });

  setInterval(function () {
    accept(read());
  }, 150);

  function subscribe(fn) {
    listeners.push(fn);
    const current = latest || read();
    if (current) {
      lastRev = current.rev;
      latest = current;
      fn(current);
    }
    return current;
  }

  function pingAs(role) {
    try {
      localStorage.setItem(QUIZ_PING_PREFIX + role, String(Date.now()));
    } catch (err) {
      /* ignore */
    }
  }

  function storagePing(role) {
    try {
      const raw = localStorage.getItem(QUIZ_PING_PREFIX + role);
      return !!raw && Date.now() - Number(raw) < 6000;
    } catch (err) {
      return false;
    }
  }

  function announce(role) {
    myRole = role;
    pingAs(role);
    post({ type: 'hello' });
    setInterval(function () {
      pingAs(role);
      post({ type: 'ping' });
    }, 1500);
  }

  /* True when the other half of the game is reachable, either through the
     window link or a recent heartbeat in shared storage. */
  function partnerLive() {
    try {
      if (partner && !partner.closed) return true;
    } catch (err) {
      /* cross-window access can throw once the window is gone */
    }
    if (Date.now() - partnerSeen < 5000) return true;
    return storagePing(myRole === 'console' ? 'board' : 'console');
  }

  function setPartner(win) {
    if (win) {
      partner = win;
      post({ type: 'hello' });
    }
    return win;
  }

  return {
    read: read,
    write: write,
    subscribe: subscribe,
    announce: announce,
    partnerLive: partnerLive,
    setPartner: setPartner
  };
})();
