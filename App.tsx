import React from 'react';
import { Button, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { FaceLivenessCAFStage, FaceLivenessFilter, IFaceLivenessConfig } from './src/caf-bridge-sdk/FaceLivenessHook/types.d';
import FaceLivenessHook from './src/caf-bridge-sdk/FaceLivenessHook';

const App: React.FC<any> = () => {

  const backgroundStyle = {
    backgroundColor: Colors.lighter,
  };

  //Insert your generated JWT here. Check documentation here: https://docs.caf.io/sdks/access-token
  const mobileToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI2Mjg2YmU5Mzg2NDJmZDAwMDk4NWE1OWUiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.muHfkGn9ToDyt9cT_z6vHPNLH0GfDNJJ2WtnnsrqFpU";
  //Insert user's CPF to run FaceAuthenticator SDK
  const CPF = "64312743509"

  const FaceLivenessConfig: IFaceLivenessConfig = {
    cafStage: FaceLivenessCAFStage.DEV,
    filter: FaceLivenessFilter.NATURAL,
    setEnableScreenshots: false,
    setLoadingScreen: true
  }

  // FaceLiveness
  const [sendFaceLiveness, faceLivenessData, loadingFaceLiveness, faceLivenessError] = FaceLivenessHook(mobileToken, FaceLivenessConfig);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle='dark-content'
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: Colors.white,
          }}>
          <View style={styles.sectionContainer}>
            <Button
              title='Execute FaceLiveness'
              onPress={() => sendFaceLiveness(CPF)}
            />
            <Text style={[styles.sectionTitle, {
              color: Colors.black
            },]}>
              {loadingFaceLiveness ? 'Loading ...' : ''}</Text>
            <View style={styles.sectionResultContainer}>
              {!!faceLivenessError && <Text style={[styles.sectionResultText, {
                color: Colors.black
              },]}>
                {`${faceLivenessError.type}: \n ${faceLivenessError.message}`}</Text>}
              {faceLivenessData && <Text style={[styles.sectionResultText, {
                color: Colors.black
              },]}>
                {'FaceLivenessResult:\n' + JSON.stringify(faceLivenessData)}</Text>}
            </View>
            <Text style={[styles.sectionTitle, {
              color: Colors.black
            },]}></Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    marginHorizontal: 40,
    marginTop: 20,
    paddingHorizontal: 24,
    backgroundColor: '#42d602',
    borderRadius: 8,
  },
  sectionResultContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  sectionResultText: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 25,
    textAlign: 'auto',
  },
});

export default App;