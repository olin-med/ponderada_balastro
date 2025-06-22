import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { colors, spacing } from '../theme';
import Toast from 'react-native-toast-message';
import { signup } from '../api';
import { useNavigation } from '@react-navigation/native';

export default function SignupScreen() {
  const nav = useNavigation<any>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!username || !password) {
      Toast.show({ type: 'error', text1: 'Fill in both fields' });
      return;
    }
    setLoading(true);
    try {
      await signup(username, password);
      nav.replace('Menu');
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Signup failed', text2: e?.response?.data?.error ?? e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>♠ Blackjack</Text>
      <Text style={styles.subtitle}>Create account</Text>

      <Input placeholder="Username" value={username} onChangeText={setUsername} />
      <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <Button label="Sign Up" onPress={handleSignup} disabled={loading} />
      <Pressable onPress={() => nav.goBack()}>
        <Text style={styles.link}>← Back to login</Text>
      </Pressable>
    </View>
  );
}

const Input = (props: any) => (
  <TextInput
    {...props}
    style={[styles.input, props.style]}
    placeholderTextColor="#888"
    autoCapitalize="none"
  />
);
const Button = ({ label, onPress, disabled }: any) => (
  <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [
    styles.btn, pressed && { opacity: 0.7 }, disabled && { opacity: 0.3 }]}>
    <Text style={styles.btnText}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing(6) },
  title: { marginTop: spacing(10), fontSize: 32, fontWeight: '800', color: colors.gold, textAlign: 'center' },
  subtitle: { fontSize: 22, color: colors.text, marginTop: spacing(8), marginBottom: spacing(4), textAlign: 'center' },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: 6,
    padding: spacing(4),
    fontSize: 16,
    marginVertical: spacing(2),
  },
  btn: { backgroundColor: colors.green, paddingVertical: spacing(4), borderRadius: 6, marginTop: spacing(6), alignItems: 'center' },
  btnText: { color: colors.text, fontSize: 18, fontWeight: '600' },
  link: { color: colors.gold, marginTop: spacing(4), textAlign: 'center' },
});
