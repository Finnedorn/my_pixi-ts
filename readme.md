<!-- questa build e' relativa alla versione di PixiJs 7.1.2  -->
<!-- creiamo una build che monti tramite webpack ts e pixijs -->
<!-- 1) inizializiamo Nodejs -->
npm init -y
<!-- 2) installiamo i pacchetti di PixieJs (v7.1.2) / Typescript / Webpack e pacchetti aggiuntivi  -->
npm install pixi.js typescript webpack webpack-cli webpack-dev-server ts-loader copy-webpack-plugin html-webpack-plugin terser-webpack-plugin
<!-- 
sezioniamola assieme:

- webpack: Uno strumento di build open-source per JavaScript quindi gestisce la compilazione del codice e l'organizzazione delle dependencies.

- webpack-cli: L'interfaccia a riga di comando per Webpack. Consente di configurare e utilizzare Webpack tramite la riga di comando, fornendo comandi come webpack build, webpack serve, e così via.

- webpack-dev-server: Un server di sviluppo che consente di eseguire l'applicazione in locale ed applica subito le modifiche
alla pagina senza obbligarci al reload.

- ts-loader: Un loader per Webpack che consente di compilare file TypeScript (.ts e .tsx) all'interno di un progetto. Converte i file TypeScript in JavaScript, che può essere compreso ed eseguito dai browser.

- copy-webpack-plugin: Un plugin di Webpack che copia file o directory dalla directory di origine alla directory di build. Si occupera' di gestire la sistemazione degli asset.

- html-webpack-plugin: Un plugin di Webpack che si occupa di teenre il file html sempre aggiornato e compilato.

- terser-webpack-plugin: Un plugin di Webpack per minimizzare (compressione e riduzione delle dimensioni) JavaScript.
-->

<!-- 3) creiamo il file tsconfig.json e definiamo questi dettagli -->
{
  "compilerOptions": {
    <!-- la versione di js adottata per la compilazione -->
    "target": "es5",
    <!-- il sistema di gestione moduli adottato: commonJs e' utilizzato da Webpack e Nodejs -->
    "module": "commonjs",
    <!-- attivo il sistema di mapping che ermette al browser di risalire per la segnalazione degli errori fino al codice sorgente del file Typescript -->
    "sourceMap": true,
    <!-- abilita tutte le opzioni di controllo rigoroso riducendo il rischio di errori  -->
    "strict": true,
    <!-- attiva il supporto di interoperabilita' permettendo di importare moduli per la versione ES6 di Js pure in commonjs -->
    "esModuleInterop": true,
    <!-- forza il compilatore Ts a considerare differente tra maius e minusc riducendo il rischio di errori post compilazione -->
    "forceConsistentCasingInFileNames": true
  }
}

<!-- 4) creiamo il file webpack.config.json per settare webpack per la gestione di un progetto in Ts -->
<!-- importo path (modulo nativo di Nodejs per la gestione dei percorsi) ed vari pacchetti plugin di webpack -->
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
<!-- esporto il modulo composto da una funzione con due attributi (env, arg) -->
module.exports = (env, argv) => {
  return {
    <!-- imposta la modalita' di esecuzione di webpack su production o development sulla base dell'argv passato dalla riga di comando: production ottimizza il codice migliorando le prestazioni, development fornisce info per il debugging -->
    mode: argv.mode === 'production' ? 'production' : 'development',
    <!-- riduce al minimo l'output codice di webpack per rendere la compilazione quanto piu' pulita possibile -->
    stats: 'minimal', 
    <!-- specifica il percoros file dal quale webpack inizeira' la creazione del bundle (compilazione) -->
    entry: './src/index.ts', 
    <!-- specifica il percorso di destinazione del bundle compilato generatoda webpack -->
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    <!-- i settings per il server di sviluppo -->
    devServer: {
      compress: true,
      allowedHosts: 'all', // If you are using WebpackDevServer as your production server, please fix this line!
      static: false,
      client: {
        logging: 'warn',
        overlay: {
          errors: true,
          warnings: false,
        },
        progress: true,
      },
      <!-- le specifiche di port ed host -->
      port: 1234,
      host: '0.0.0.0',
    },
    <!-- disabilitiamo gli avvisi di prestazioni che vengono emessi quandi si superano tot dimensioni di file, questo perche' in genere le app che contengono build di games sono molto grandi -->
    performance: { hints: false },
    devtool: argv.mode === 'development' ? 'eval-source-map' : undefined,
    <!-- abilitiamo le impostazioni di ottimizzazione per minimizzare quanto piu' la portata del codice generato in js  -->
    optimization: {
      minimize: argv.mode === 'production',
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: 6,
            <!-- rimuove i console log -->
            compress: { drop_console: true },
            <!-- rimuove i commenti -->
            output: { comments: false, beautify: false },
          },
        }),
      ],
    },
    <!-- qua setteremo come webpack dovra gestire il file Ts -->
    module: {
      rules: [
        {
        <!-- cerca file con estensione .ts o .tsx -->
          test: /\.ts(x)?$/,
          <!-- utilizza ts-loader per la compilazione del Ts in Js -->
          loader: 'ts-loader',
          <!-- esclude la cartella node_modules dalla compilazione -->
          exclude: /node_modules/,
        },
      ],
    },
    <!-- specifica quale estensione dei file Webpack dovra' considerare durante la gestione dei moduli -->
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    <!-- configuriamo i plugins -->
    plugins: [
        <!-- copyplugin e' responsabile della gestione dei file, in questo caso e' settato per copiare tutti i file della cartella asset, ovvero dove piazzeremo tutte le nostre texture, in dist. In questo caso non avendo file e' commentato? disabilitato -->
      // new CopyPlugin({
      //   patterns: [{ from: 'assets/' }],
      // }),
      <!-- genera un file html utilizzando come modello quello specificato (index.html) -->
      new HtmlWebpackPlugin({
        template: 'index.html',
        hash: true,
        minify: false,
      }),
    ],
  }
}
<!-- in sostanza non necessitiamo di abilitare un comando di watch per il file ts in quanto questi di settings di webpack si occuperano della compilazione automatica dell'app passo per passo -->
<!-- 5) creiamo il nostro fila index.html con l'elemento in body per il canvas -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>My Game</title>
  </head>
  <body>
    <canvas id="game-canvas"></canvas>
  </body>
</html>
<!-- 6) settiamo il nostro file PixiJs con la nostra applicazione, esempio: -->
import * as PIXI from 'pixi.js'

const app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0x1099bb,
  view: document.getElementById('game-canvas') as HTMLCanvasElement,
})

PIXI.Assets.load(['flowerTop.png'], () => {
  const myTexture = PIXI.Texture.from('flowerTop.png')

  const mySprite = new PIXI.Sprite(myTexture)
  mySprite.anchor.set(0.5)
  mySprite.x = app.screen.width / 2
  mySprite.y = app.screen.height / 2

  app.stage.addChild(mySprite)

  app.ticker.add((_delta) => {
    mySprite.rotation += 0.05
  })
})

