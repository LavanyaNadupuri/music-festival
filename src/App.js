import React, {Component} from 'react';
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            isLoaded: false
        }
    }

    componentDidMount() {

        fetch('http://eacodingtest.digital.energyaustralia.com.au/api/v1/festivals')
            .then(results => {
                return results.json()
            })
            .then(data => {
                this.setState({
                    isLoaded: true,
                    items: data
                })
            })

    }

    arrangeItems(items) {
        let festivals = items;
        let recordLabel = [];
        for (let i = 0; i < festivals.length; i++) {
            let bands = festivals[i].bands;
            for (let j = 0; j < bands.length; j++) {
                if (bands[j].recordLabel != null && bands[j].recordLabel !== "") {
                    let finalList = {name: "", band: []};
                    let band = {bandName: "", festival: ""};
                    if (!this.containsName(recordLabel, "name", bands[j].recordLabel)) {
                        finalList.name = bands[j].recordLabel;
                        if (bands[j].name != null && bands[j].name !== "")
                            band.bandName = bands[j].name;
                        if (festivals[i].name != null && festivals[i].name !== "")
                            band.festival = festivals[i].name;
                        finalList.band[0] = band;
                        recordLabel.push(finalList);
                    } else {
                        let idx = this.findName(recordLabel, bands[j].recordLabel);
                        band.bandName = bands[j].name;
                        band.festival = festivals[i].name;
                        recordLabel[idx].band.push(band);
                    }
                }

            }
        }
        return recordLabel;
    }

    containsName(arr, key, value) {
        for (let i = 0; i < arr.length; i++) {
            if (key === "bandName") {
                if (arr[i].bandName === value) {
                    return true;
                }
            } else {
                if (arr[i].name === value) {
                    return true;
                }
            }
        }
        return false;
    }

    findName(arr, name) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].name === name) {
                return i;
            }
        }
        return -1;
    }

    render() {
        let {isLoaded, items} = this.state;
        if (!isLoaded) {
            return <div>Loading.....</div>;
        } else
        {
            let ListOfLabels = this.arrangeItems(items);
            return (
                <ul>
                    {ListOfLabels.sort((a, b) => a.name.localeCompare(b.name)).map((item, index) => (
                        <div>
                            <li key={item.name + index}>{item.name}</li>
                            <ul>
                                {item.band.sort((a, b) => a.bandName.localeCompare(b.bandName)).map((bands, i) => (
                                    <div>
                                        <ul>
                                            <li key={bands.bandName+i}>{bands.bandName}</li>
                                            <ul>
                                                <li key={bands.festival+i}>{bands.festival}</li>
                                            </ul>
                                        </ul>
                                    </div>
                                ))}
                            </ul>
                        </div>
                    ))}
                </ul>
            );
        }

    }

}


export default App;
