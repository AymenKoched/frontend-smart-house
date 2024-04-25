import {useMemo} from "react";

const ConnectedDevices = ({carte}) => {
    const devices = useMemo(() => {
        const temp = [];
        carte.lampes.forEach(lampe => {
            temp.push({
                pin: lampe.pin,
                nom: lampe.nom,
                etage: lampe.etage.nom
            });
        });
        carte.stores.forEach(store => {
            temp.push({
                pin: store.pin1,
                nom: store.nom,
                etage: store.etage.nom
            });
            temp.push({
                pin: store.pin2,
                nom: store.nom,
                etage: store.etage.nom
            });
        });

        carte.connectedElements.forEach(element => {
            if (element.deviceId === null) {
                temp.push({
                    pin: element.pin,
                    nom: '---',
                    etage: '---'
                });
            }
        });

        return temp.sort((a,b) => a.pin - b.pin);
    },[carte]);

    return (
        <div className="listeDevices">
            <table>
                <thead>
                    <tr>
                        <th>Input </th>
                        <th>Nom de l'appareil</th>
                        <th>Etage de l'appareil</th>
                    </tr>
                </thead>
                <tbody>
                    {devices.map((device) => (
                        <tr key={device.pin}>
                            <td>{device.pin}</td>
                            <td>{device.nom}</td>
                            <td>{device.etage}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
      </div>
    );
    
}
 
export default ConnectedDevices;