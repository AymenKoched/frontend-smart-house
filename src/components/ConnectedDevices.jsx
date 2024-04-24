const ConnectedDevices = ({connectedDevices}) => {
    const deviceEntries = Object.entries(connectedDevices);

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
                    {deviceEntries.map(([deviceName, value]) => (
                        <tr key={deviceName}>
                            <td>{deviceName}</td>
                            <td>{value.nom}</td>
                            <td>{value.etage}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
      </div>
    );
    
}
 
export default ConnectedDevices;