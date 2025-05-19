import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Input, Button, Text, Icon } from 'react-native-elements';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function RegisterScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState<any>({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const errors: any = validateForm();

      if (Object.keys(errors).length > 0) {
        setFormError(errors);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        navigation.replace('Home');
      }
    } catch (error: any) {
      setError('Error al registrarse: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.,+-])[A-Za-z\d!@#$%^&*.,+-]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    let formErrors: any = {};
    if (!email) {
      formErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = 'Email inválido';
    }

    if (!password) {
      formErrors.password = 'La contraseña es requerida';
    } else if (!validatePassword(password)) {
      formErrors.password =
        'La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial';
    }

    if (password !== confirmPassword) {
      formErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    return formErrors;
  };

  const enableRegisterButton = () => {
    const isEmailValid = /\S+@\S+\.\S+/.test(email);
    const isPasswordValid = password.length > 0;
    const isConfirmPasswordValid = confirmPassword.length > 0;
    return isEmailValid && isPasswordValid && isConfirmPasswordValid;
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>
        Registro
      </Text>
      <Input
        label="Email"
        placeholder="Ingresa tu correo..."
        placeholderTextColor='#c8c8c8'
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        inputMode="email"
        errorMessage={formError?.email}
        style={formError?.email ? styles.inputError : {}}
      />
      <Input
        label="Contraseña"
        placeholder="Escribe tu contraseña..."
        placeholderTextColor='#c8c8c8'
        autoCapitalize="none"
        value={password}
        onChangeText={(text) => {
          setPassword(text.trim());
        }}
        secureTextEntry={!passwordVisible}
        errorMessage={formError?.password}
        rightIcon={
          <Icon
            name={passwordVisible ? 'eye-slash' : 'eye'}
            color="gray"
            type="font-awesome-5"
            onPress={() => setPasswordVisible(!passwordVisible)}
          />
        }
        keyboardType="default"
        style={formError?.password ? styles.inputError : {}}
      />
      <Input
        label="Confirmar contraseña"
        placeholder="Confirma tu contraseña..."
        placeholderTextColor='#c8c8c8'
        value={confirmPassword}
        autoCapitalize="none"
        onChangeText={(text) => {
          setConfirmPassword(text.trim());
        }}
        secureTextEntry={!confirmPasswordVisible}
        errorMessage={formError?.confirmPassword}
        rightIcon={
          <Icon
            name={confirmPasswordVisible ? 'eye-slash' : 'eye'}
            color="gray"
            type="font-awesome-5"
            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          />
        }
        keyboardType="default"
        style={formError?.password ? styles.inputError : {}}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {isLoading ? (
        <ActivityIndicator size="large" color="gray" />
      ) : (
        <Button
          title="Registrarse"
          disabled={!enableRegisterButton()}
          onPress={handleRegister}
          containerStyle={styles.button}
        />
      )}
      <Button
        title="Volver al Login"
        type="outline"
        onPress={() => navigation.navigate('Login')}
        containerStyle={styles.button}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    marginVertical: 10,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  inputError: {
    borderBottomColor: 'red',
    borderBottomWidth: 1,
  },
});
