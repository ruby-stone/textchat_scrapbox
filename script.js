(async function main() {
  //DOM操作
  const localId = document.getElementById('js-local-id');
  const localText = document.getElementById('js-local-text');
  const connectTrigger = document.getElementById('js-connect-trigger');
  const closeTrigger = document.getElementById('js-close-trigger');
  const sendTrigger = document.getElementById('js-send-trigger');
  const remoteId = document.getElementById('js-remote-id');
  const messages = document.getElementById('js-messages');
  const meta = document.getElementById('js-meta');
  const sdkSrc = document.querySelector('script[src*=skyway]');
  //ブラウザの判定とSDK判定
  meta.innerText = `
    UA: ${navigator.userAgent}
    SDK: ${sdkSrc ? sdkSrc.src : 'unknown'}
  `.trim();
//シグナリングサーバーへ接続
  const peer = new Peer({
    key:'b75c7d77-996a-4e4b-bec3-2476cc6e1036',
    debug: 3,
  });

  //Peerに接続するイベント
  connectTrigger.addEventListener('click', () => {
    if (!peer.open) {
      return;
    }
//Peerに接続
    const dataConnection = peer.connect(remoteId.value);
//接続に成功した際にメッセージを表示しイベントリスナーを登録
    dataConnection.once('open', async () => {
      messages.textContent += `=== DataConnection has been opened ===\n`;

      sendTrigger.addEventListener('click', onClickSend);
    });
//受信した文字を表示
    dataConnection.on('data', data => {
      messages.textContent += `Remote: ${data}\n`;
    });
//通信を切断した時メッセージとイベントリスナ―解除
    dataConnection.once('close', () => {
      messages.textContent += `=== DataConnection has been closed ===\n`;
      sendTrigger.removeEventListener('click', onClickSend);
    });
   //通信切断するイベント
    closeTrigger.addEventListener('click', () => dataConnection.close(true), {
      once: true,
    });
//文字を送信
    function onClickSend() {
      const data = localText.value;
      dataConnection.send(data);
      messages.textContent += `You: ${data}\n`;
      localText.value = '';
    }
  });
//Peer IDを表示
  peer.once('open', id => (localId.textContent = id));
//受信があった際の処理
  peer.on('connection', (dataConnection) => {
    dataConnection.once('open', async () => {
      messages.textContent += `=== DataConnection has been opened ===\n`;

      sendTrigger.addEventListener('click', onClickSend);
    });

    dataConnection.on('data', data => {
      messages.textContent += `Remote: ${data}\n`;
    });

    dataConnection.once('close', () => {
      messages.textContent += `=== DataConnection has been closed ===\n`;
      sendTrigger.removeEventListener('click', onClickSend);
    });

    closeTrigger.addEventListener('click', () => dataConnection.close(true), {
      once: true,
    });

    function onClickSend() {
      const data = localText.value;
      dataConnection.send(data);

      messages.textContent += `You: ${data}\n`;
      localText.value = '';
    }
  });

  peer.on('error', console.error);
})();

