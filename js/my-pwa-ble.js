

let writeCharacteristic ;

async function connectBluetoothDevice(){
  try{
    const device = await navigator.bluetooth.requestDevice({
                      acceptAllDevices: true});
    console.log("waiting for connection...");

    const server = await device.gatt.connect();

      // Note that we could also get all services that match a specific UUID by
      // passing it to getPrimaryServices().
      console.log('Getting Services...');
      const service = await server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e');
      console.log('Service found' + service);
      const receiveCharacteristic = await service.getCharacteristic('6e400003-b5a3-f393-e0a9-e50e24dcca9e');
      console.log('Read Characteristic RX found' + receiveCharacteristic);
      writeCharacteristic = await service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e');
      console.log('Write Characteristic TX found' + writeCharacteristic);
      receiveCharacteristic.addEventListener('characteristicvaluechanged',handleReceivedChanged);
      await receiveCharacteristic.startNotifications();
      console.log('> Receive Notifications started');

    } catch(error) {
      console.log('Argh! ' + error);
      }
}

function handleReceivedChanged(event) {
  let receivedString = event.target.value;
  var string = new TextDecoder("utf-8").decode(receivedString);
  console.log('received string =  ' + string);
  document.getElementById("received_data").value = string;
}

function writeBluetoothDevice()
{
  var enc = new TextEncoder(); // always utf-8
  console.log("write device..");
  let commandValue = new Uint8Array([0x31,0x32,0x33,0x34,0x0D,0x0A]);
    commandValue = document.getElementById("send_data").value;
    commandValue = commandValue + "\r\n";
    console.log(commandValue);
    writeCharacteristic.writeValue(enc.encode(commandValue));
}