const serialport = require('serialport');

const $portsSelect = document.querySelector('select#ports');
const $colorViewer = document.querySelector('#color-viewer');
const $baudrateSelect = document.querySelector('select#baudrate');
const $openSerialButton = document.querySelector('button#open-serial');

let activeSerial;
let message = '';

$openSerialButton.addEventListener('click', () => {
  const port = $portsSelect.value;
  const baudrate = $baudrateSelect.value >>> 0;
  if(activeSerial) activeSerial.close();
  activeSerial = serialport(port, { baudRate: baudrate });
  activeSerial.on('data', (chunk) => {
    const data = String(chunk);
    const index = data.indexOf('\n');
    if(data.includes('\n')) {
      message += data;
      console.log(message);
      $colorViewer.style.backgroundColor = message;
      message = '';
    } else {
      message += data;
    }
  });
});

serialport.list((err, ports) => {
  if(err) {
    document.getElementById('error').textContent = err.message
    return
  } else if(ports.length === 0) {
    document.getElementById('error').textContent = 'No ports discovered'
  } else {
    document.getElementById('error').textContent = ''
    console.log('ports', ports);
    ports.filter(port => port.serialNumber).forEach(port => {
      const $option = document.createElement('option');
      $option.value = port.comName;
      $option.label = port.comName;
      $portsSelect.appendChild($option);
    });
  }
});