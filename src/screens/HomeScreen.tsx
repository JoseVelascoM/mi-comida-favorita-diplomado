import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }: { navigation: any }) {
  const [profile, setProfile] = useState({
    nombre: '',
    apellido: '',
    comidaFavorita: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoadingData(true);
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.error('No hay usuario autenticado');
        return;
      }

      const docRef = doc(db, 'usuarios', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();

        setProfile({
          nombre: data?.nombre ?? '',
          apellido: data?.apellido ?? '',
          comidaFavorita: data?.comidaFavorita ?? '',
        });
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.error('No hay usuario autenticado');
        return;
      }

      await setDoc(doc(db, 'usuarios', uid), profile);
      alert('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      alert('Error al actualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (isLoadingData) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="gray" />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Text h4 style={styles.title}>
        Mi Perfil
      </Text>
      <Input
        label="Nombre"
        placeholder="Ingresa tu nombre..."
        placeholderTextColor='#c8c8c8'
        value={profile.nombre}
        onChangeText={(text) => setProfile({ ...profile, nombre: text })}
      />
      <Input
        label="Apellido"
        placeholder="Ingresa tu apellido..."
        placeholderTextColor='#c8c8c8'
        value={profile.apellido}
        onChangeText={(text) => setProfile({ ...profile, apellido: text })}
      />
      <Input
        label="Comida favorita"
        placeholder="¿Cuál es tu comida favorita?"
        placeholderTextColor='#c8c8c8'
        value={profile.comidaFavorita}
        onChangeText={(text) =>
          setProfile({ ...profile, comidaFavorita: text })
        }
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="gray" />
      ) : (
        <Button
          title="Actualizar Perfil"
          onPress={handleUpdate}
          containerStyle={styles.button}
        />
      )}
      <Button
        title="Cerrar Sesión"
        type="outline"
        onPress={handleSignOut}
        containerStyle={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    marginVertical: 10,
  },
});
