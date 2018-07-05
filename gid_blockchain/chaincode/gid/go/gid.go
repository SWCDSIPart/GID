/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * The sample smart contract for documentation topic:
 * Writing Your First Blockchain Application
 */

package main

/* Imports
 * 4 utility libraries for formatting, handling bytes, reading and writing JSON, and string manipulation
 * 2 specific Hyperledger Fabric specific libraries for Smart Contracts
 */
import (
	"bytes"
	"encoding/json"
	"fmt"
//	"strconv"
//	"strings"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// Define the Smart Contract structure
type SmartContract struct {
}

type GID struct {
	Gid		string `json:"gid"`
	Type	string `json:"type"`
	Parent	string `json:"parent"`
	Children	[]string `json:"children"`
	Key		string `json:"key"`
	Metadata string `json:"metatdata"`
}


//var ca_hit, ca_miss float32
//var cache [MAX_CACHE_SIZE][]byte
/*
 * The Init method is called when the Smart Contract "gid" is instantiated by the blockchain network
 * Best practice is to have any Ledger initialization in separate function -- see initLedger()
 */
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

/*
 * The Invoke method is called as a result of an application request to run the Smart Contract "gid"
 * The calling application program has also specified the particular smart contract function to be called, with arguments
 */
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger appropriately
	switch function {
	case "createGID" :
		return s.createGID(APIstub, args)
	case "queryGID" :
		return s.queryGID(APIstub, args)
	case "updateGID" :
		return s.updateGID(APIstub, args)
	case "deleteGID" :
		return s.deleteGID(APIstub, args)
	case "getParent" :
		return s.getParent(APIstub, args)
	case "initLedger" :
		return s.initLedger(APIstub)
	case "queryAll" : // depricated
		return s.queryAll(APIstub)
	}

	return shim.Error("Invalid Smart Contract function \"name\".")
}


func (s *SmartContract) createGID(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
  }

	var gid0 GID
	_= json.Unmarshal([]byte(args[0]), &gid0)
	valAsBytes, _ := json.Marshal(gid0)
	APIstub.PutState(gid0.Gid, valAsBytes)

	return shim.Success(nil)
}


func (s *SmartContract) queryGID(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}
	valAsBytes, _ := APIstub.GetState(args[0])

	return shim.Success(valAsBytes)
}


func (s *SmartContract) updateGID(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
  }

	var gid0 GID
	_= json.Unmarshal([]byte(args[1]), &gid0)

	if gid0.Gid != args[0] {
		return shim.Error("GID not matched: " + args[0] + ":" + gid0.Gid)
  }

	valAsBytes, _ := json.Marshal(gid0)
	APIstub.PutState(gid0.Gid, valAsBytes)

	return shim.Success(nil)
}


func (s *SmartContract) deleteGID(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	APIstub.DelState(args[0])

	return shim.Success(nil)
}


func (s *SmartContract) getParent(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	var gid0 GID
	valAsBytes, _ := APIstub.GetState(args[0])
	_= json.Unmarshal(valAsBytes, &gid0)
	parentVal, _ := APIstub.GetState(gid0.Parent)

	return shim.Success(parentVal)
}


func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	vals := [][]byte{
		[]byte(`{"gid":"08A4D1DB1438FF353FA5E8B29830B4088377898568CA47A50EB7E386453E3AA8", "type":"person", "parent":"", "children" : ["F5AA85054BC2A1912996F9E4B2685F8088CEDEFA7997315E484160F82523EB48", "23E7CDC6D42116565405B57CA27F11A01640C6FEB482BC4DDB0B6E928F7CBBE3", "00DEDD0C67B1A74792A93D899C82F2E2D89272D2BE541D07E6B58705251C333E"], "key":"", "metadata":""}`),
		[]byte(`{"gid":"23E7CDC6D42116565405B57CA27F11A01640C6FEB482BC4DDB0B6E928F7CBBE3", "type":"device", "parent":"08A4D1DB1438FF353FA5E8B29830B4088377898568CA47A50EB7E386453E3AA8", "children" : [""], "key":"", "metadata":""}`),
		[]byte(`{"gid":"F5AA85054BC2A1912996F9E4B2685F8088CEDEFA7997315E484160F82523EB48", "type":"device", "parent":"08A4D1DB1438FF353FA5E8B29830B4088377898568CA47A50EB7E386453E3AA8", "children" : [""], "key":"", "metadata":""}`),
		[]byte(`{"gid":"00DEDD0C67B1A74792A93D899C82F2E2D89272D2BE541D07E6B58705251C333E", "type":"device", "parent":"08A4D1DB1438FF353FA5E8B29830B4088377898568CA47A50EB7E386453E3AA8", "children" : [""], "key":"", "metadata":""}`)}

	i := 0
	for i < len(vals) {
		var gid0 GID
		_= json.Unmarshal([]byte(vals[i]), &gid0)

 		APIstub.PutState(gid0.Gid, vals[i])

 		fmt.Println("Added", vals[i])
		i = i + 1
	}


	//
  //       vals := []GID{
  //               GID{Value: []byte("{\"phone\": \"" + strings.ToLower("08A4D1DB1438FF353FA5E8B29830B4088377898568CA47A50EB7E386453E3AA8") + "\", \"name\": \"\uBC15\uD604\uCCA0\"}")},
  //               GID{Value: []byte("{\"phone\": \"" + strings.ToLower("F5AA85054BC2A1912996F9E4B2685F8088CEDEFA7997315E484160F82523EB48") + "\", \"name\": \"\uC870\uD604\uAE38\"}")},
  //               GID{Value: []byte("{\"phone\": \"" + strings.ToLower("23E7CDC6D42116565405B57CA27F11A01640C6FEB482BC4DDB0B6E928F7CBBE3") + "\", \"name\": \"\uC131\uC5F4\uC6C5\"}")},
  //               GID{Value: []byte("{\"phone\": \"" + strings.ToLower("00DEDD0C67B1A74792A93D899C82F2E2D89272D2BE541D07E6B58705251C333E") + "\", \"name\": \"\uD64D\uC131\uD604\"}")},
  //               GID{Value: []byte("{\"phone\": \"" + strings.ToLower("77CFBC6E0B0702A55E2D6B4E577098982A14B96786BDCD50B17D296A75F03388") + "\", \"name\": \"\uAE40\uC0C1\uBBFC\"}")},
  //               GID{Value: []byte("{\"phone\": \"" + strings.ToLower("FCD5F414E627DC356C465E3C3B70DDA85CA8C83B543926D21BE62CFBC72A8EEE") + "\", \"name\": \"\uAE40\uC218\uD604\"}")},
  //               GID{Value: []byte("{\"phone\": \"" + strings.ToLower("EA5EA7A265AD27E7C0AAA5048480E7F5DBAF31B0543FD834D2AEF54BB99AD77B") + "\", \"name\": \"\uC774\uB3D9\uD604\"}")},
  //               GID{Value: []byte("{\"phone\": \"" + strings.ToLower("38EC4EDC26BE422B1C0007F1A9C4EABD88BEB7EE5F009F7F041905DF9105ECF2") + "\", \"name\": \"\uCD5C\uC2B9\uBC94\"}")},
  //               GID{Value: []byte("{\"phone\": \"" + strings.ToLower("10EBF889051EAE5EAFBA521CAE58C29E10E4ACD217B47AA5927B7F9E92F60C2A") + "\", \"name\": \"\uC548\uAE38\uC900\"}")},
  //               GID{Value: []byte("{\"phone\": \"" + strings.ToLower("142148649075BFB21C0EC50EC3AE94EC2DCE5F4BC138E398C82B56584790393E") + "\", \"name\": \"\uC870\uC2B9\uD658\"}")},
  //               GID{Value: []byte("{\"phone\": \"" + strings.ToLower("F16551334EDB3EF1091AF1409C6993C258352553F9FE4FF8B2DC3DE99617BDDC") + "\", \"name\": \"\uC870\uD61C\uC740\"}")},
  //               GID{Value: []byte("{\"phone\": \"" + strings.ToLower("7B6C8D536F8ABE4FFB9CA895CC41E1EA1336FD6A470664AFA994E458D13E1ED2") + "\", \"name\": \"\uB098\uC601\uADFC\"}")},
  //               GID{Value: []byte("{\"phone\": \"" + strings.ToLower("BFCAC59ABF989396137F047892FCF0B4E5F8AC449DD8D9C2F8604BAF344DE421") + "\", \"name\": \"\uD55C\uACBD\uC644\"}")},
  //               GID{Value: []byte("{\"phone\": \"" + strings.ToLower("9E912D127474DE66F60A6F04B088E115DCB9A15BBD5569924610B61BFD012887") + "\", \"name\": \"\uAE40\uAE30\uD64D\"}")},
  //               GID{Value: []byte("{\"phone\": \"" + strings.ToLower("6BF9772F899ECE0268DC5A9DF7D0513D4CD03CE08815FFFBDD50521CB7734F7F") + "\", \"name\": \"\uCD5C\uACBD\uC9C4\"}")},
  //               GID{Value: []byte("{\"phone\": \"" + strings.ToLower("76E3191B3EC522A803A81EEA5B73413E035511577A76721C90B20DBAC65814F2") + "\", \"name\": \"\uC624\uC6D0\uC11D\"}")},
  //               GID{Value: []byte("{\"phone\": \"" + strings.ToLower("D1A88D8D69332A686F0852E459325A1E9FC06AF3D5E96413DD7114F9AB28B315") + "\", \"name\": \"\uC870\uD604\uAE38\"}")},
  //               GID{Value: []byte("{\"phone\": \"" + strings.ToLower("F2CDEE7D1B552661CD766FA4D8BDE2CB4FA598A7FC63DBAEF03D595770D42B41") + "\", \"name\": \"\uBC15\uC5B4\uB9B0\"}")},
  //               GID{Value: []byte("{\"phone\": \"" + strings.ToLower("CA6D84DCD41EA2D0D2DAB690FF69E975EECAB01145A801790692F01DF36C60AB") + "\", \"name\": \"\uC815\uD604\uCDA9\"}")},
  //               GID{Value: []byte("{\"phone\": \"" + strings.ToLower("308C28BE168539B706A3CC965E1D124B1EFAEAE27C1AD5A627A5C1CDF2A19821") + "\", \"name\": \"\uC624\uCC3D\uB9BD\"}")},
  //       }
	//
	// j := 0
	// k := 0
	// for j < 500 {
	//         i := 0
	//
	// 	for i < len(vals) {
	// 		//valAsBytes, _ := json.Marshal(vals[i])
	// 		//APIstub.PutState(strconv.Itoa(k), valAsBytes)
	// 		APIstub.PutState(strconv.Itoa(k), vals[i].Value)
	// 		fmt.Println("Added", vals[i])
	// 		i = i + 1
	// 		k = k + 1
	// 	}
	// 	j = j + 1
	// }
	//
	return shim.Success(nil)
}


// depricated.
func (s *SmartContract) queryAll(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "0"
	endKey := "999999999999999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAll:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}


// The main function is only relevant in unit test mode. Only included here for completeness.
func main() {

	// Creatfmt.Printf("Error creating new Smart Contract: %s", err)e a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
