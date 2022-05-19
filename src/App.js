import React, { Component } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

const TYPES = {
  NUMBER: 'NUMBER',
  OPERATOR: 'OPERATOR',
  FUNCTION: 'FUNCTION'
}

const buttonText = [
  [
    { value: 'AC', type: TYPES.FUNCTION },
    { value: '+/-', type: TYPES.FUNCTION },
    { value: '%', type: TYPES.FUNCTION },
    { value: '÷', type: TYPES.OPERATOR }
  ],
  [
    { value: '7', type: TYPES.NUMBER },
    { value: '8', type: TYPES.NUMBER },
    { value: '9', type: TYPES.NUMBER },
    { value: 'x', type: TYPES.OPERATOR }
  ],
  [
    { value: '4', type: TYPES.NUMBER },
    { value: '5', type: TYPES.NUMBER },
    { value: '6', type: TYPES.NUMBER },
    { value: '-', type: TYPES.OPERATOR }
  ],
  [
    { value: '1', type: TYPES.NUMBER },
    { value: '2', type: TYPES.NUMBER },
    { value: '3', type: TYPES.NUMBER },
    { value: '+', type: TYPES.OPERATOR }
  ],
  [
    { value: '0', type: TYPES.NUMBER },
    { value: '.', type: TYPES.FUNCTION },
    { value: '=', type: TYPES.OPERATOR }
  ]
]

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      computeStr: '', // 目前的算法 ex: 123 + 123
      currentCompute: '', // 目前打的數字
      isComputeSum: false, // 是否有按過等於
      isTouchOperator: false
    }
  }

  render() {
    return (
      <>
        <StatusBar barStyle='dark-content' />
        <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
          <View style={Style.computeContainer}>
            <Text style={Style.computeText}>{this.state.computeStr}</Text>
            <Text style={Style.computeResult}>{this.state.currentCompute}</Text>
          </View>
          {
            buttonText.map((btn, idx) => {
              return (

                <View key={idx} style={Style.buttonContainer}>
                  {
                    btn.map(obj => {
                      if (obj.value == 0) {
                        return (
                          <TouchableOpacity key={obj.value} onPress={() => this._onPress(obj)} style={Style.touch0} activeOpacity={0.8}>
                            <Text style={{ ...Style.computeButton, color: 'black' }}>{obj.value}</Text>
                          </TouchableOpacity>
                        )
                      } else if (obj.type == TYPES.FUNCTION) {
                        return (
                          <TouchableOpacity key={obj.value} onPress={() => this._onPress(obj)} style={{ ...Style.touch, backgroundColor: 'lightgrey' }} activeOpacity={0.8}>
                            <Text style={{ ...Style.computeButton, color: 'black' }}>{obj.value}</Text>
                          </TouchableOpacity>
                        )
                      } else if (obj.type == TYPES.OPERATOR) {
                        return (
                          <TouchableOpacity key={obj.value} onPress={() => this._onPress(obj)} style={{ ...Style.touch, backgroundColor: '#ff8c00' }} activeOpacity={0.8}>
                            <Text style={{ ...Style.computeButton, color: 'white' }}>{obj.value}</Text>
                          </TouchableOpacity>
                        )
                      } else {
                        return (
                          <TouchableOpacity key={obj.value} onPress={() => this._onPress(obj)} style={{ ...Style.touch, backgroundColor: 'lightgrey', opacity: 0.7 }} activeOpacity={0.8}>
                            <Text style={{ ...Style.computeButton, color: 'black' }}>{obj.value}</Text>
                          </TouchableOpacity>
                        )
                      }
                    })
                  }
                </View>

              )
            })
          }
        </SafeAreaView>
      </>
    )
  }

  _onPress = obj => {
    if (obj.type == TYPES.FUNCTION) {
      let current = '';
      switch (obj.value) {
        case 'AC': // 將資料清空
          this.setState({
            computeStr: '',
            currentCompute: '',
            isComputeSum: false
          })
          break;
        case '+/-': // 將數值換成 +/-
          let tmpNum = Number.parseFloat(this.state.currentCompute)
          if (tmpNum > 0) {
            current = '-' + (this.state.currentCompute)
            this.setState({
              currentCompute: current
            })
          } else if (tmpNum < 0) {
            current = Math.abs(tmpNum) + ''
            this.setState({
              currentCompute: current
            })
          }
          break;
        case '%': // 將數值 x 0.01
          let currentNum = Number.parseInt(this.state.currentCompute)
          current = `${currentNum * 0.01}`
          this.setState({
            currentCompute: current
          })
          break;
        case '.': // 加上小數點
          current = this.state.currentCompute + '.'
          this.setState({
            currentCompute: current
          })
          break;
      }
    } else if (obj.type == TYPES.NUMBER) {
      if (this.state.isComputeSum) { // 如果有上個按鈕是按下=，則按下數字鍵會重置
        this.setState({
          computeStr: '',
          currentCompute: obj.value,
          isComputeSum: false
        })
      } else {
        if (this.state.currentCompute != '0') { // 如果目前不是只有輸入0
          const current = this.state.currentCompute + obj.value
          this.setState({
            currentCompute: current,
            isTouchOperator: false
          })
        } else { // 如果目前只有輸入0 那繼續按下０會沒反應
          if (obj.value != '0') {
            this.setState({
              currentCompute: obj.value,
              isTouchOperator: false
            })
          }
        }
      }
    } else { // 運算符號
      if (!this.state.isTouchOperator) { // 上一個按的不是運算符號
        if (obj.value == '=') { // 如果按下的是=
          if (this.state.isComputeSum){
            return
          }
          let tmpCuurentCompute = this.state.currentCompute
          let computeArray = tmpCuurentCompute.split(' ')
          while (computeArray.length > 1) {
            let index = computeArray.findIndex(str => str == 'x');
            if (index != -1) {
              const num1 = Number.parseFloat(computeArray[index - 1])
              const num2 = Number.parseFloat(computeArray[index + 1])
              const sum = num1 * num2
              computeArray[index - 1] = sum
              computeArray.splice(index, 2)
              continue;
            }
            index = computeArray.findIndex(str => str == '÷');
            if (index != -1) {
              const num1 = Number.parseFloat(computeArray[index - 1])
              const num2 = Number.parseFloat(computeArray[index + 1])
              const sum = num1 / num2
              computeArray[index - 1] = sum
              computeArray.splice(index, 2)
              continue;
            }
            index = computeArray.findIndex(str => str == '+');
            if (index != -1) {
              const num1 = Number.parseFloat(computeArray[index - 1])
              const num2 = Number.parseFloat(computeArray[index + 1])
              const sum = num1 + num2
              computeArray[index - 1] = sum
              computeArray.splice(index, 2)
              continue;
            }
            index = computeArray.findIndex(str => str == '-');
            if (index != -1) {
              const num1 = Number.parseFloat(computeArray[index - 1])
              const num2 = Number.parseFloat(computeArray[index + 1])
              const sum = num1 - num2
              computeArray[index - 1] = sum
              computeArray.splice(index, 2)
              continue;
            }
          }
          this.setState({
            computeStr: tmpCuurentCompute,
            currentCompute: computeArray[0],
            isComputeSum: true
          })
        } else { // 非=的運算符號
          if (this.state.currentCompute != '') { // 如果目前輸入非空
            const current = this.state.currentCompute
            this.setState({
              currentCompute: current + ' ' + obj.value + ' ',
              isComputeSum: false,
              isTouchOperator: true
            })
          }
        }
      }

    }
  }
}

const Style = StyleSheet.create({
  computeContainer: {
    height: 80,
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  computeText: {
    fontSize: 20,
    color: 'lightgrey'
  },
  computeResult: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white'
  },
  buttonContainer: {
    height: 90,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  computeButton: {
    fontWeight: 'bold',
    fontSize: 20,
    borderRadius: 160
  },
  touch0: {
    padding: 5,
    height: 80,
    width: 185,
    borderRadius: 160,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7
  },
  touch: {
    padding: 5,
    height: 80,
    width: 80,
    borderRadius: 160,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default App;