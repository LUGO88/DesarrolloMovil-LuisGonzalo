import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import useCalorieStore from '../store/calorieStore';

const ProfileScreen = ({ navigation }) => {
  const {
    profiles,
    currentProfileId,
    createProfile,
    deleteProfile,
    selectProfile,
    updateProfile,
    loadData,
    getCurrentProfile,
  } = useCalorieStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    activityLevel: 'moderate',
    calorieGoal: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const calculateCalorieGoal = (weight, height, age, gender, activityLevel) => {
    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    return Math.round(bmr * activityMultipliers[activityLevel]);
  };

  const handleCreateProfile = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }

    try {
      const calorieGoal = formData.calorieGoal || 
        calculateCalorieGoal(
          parseFloat(formData.weight) || 70,
          parseFloat(formData.height) || 170,
          parseInt(formData.age) || 25,
          formData.gender,
          formData.activityLevel
        );

      await createProfile({
        name: formData.name.trim(),
        age: parseInt(formData.age) || null,
        weight: parseFloat(formData.weight) || null,
        height: parseFloat(formData.height) || null,
        gender: formData.gender,
        activityLevel: formData.activityLevel,
        calorieGoal: parseInt(calorieGoal),
      });

      setModalVisible(false);
      resetForm();
      Alert.alert('Éxito', 'Perfil creado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el perfil');
      console.error('Error creating profile:', error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }

    try {
      const calorieGoal = formData.calorieGoal || 
        calculateCalorieGoal(
          parseFloat(formData.weight) || 70,
          parseFloat(formData.height) || 170,
          parseInt(formData.age) || 25,
          formData.gender,
          formData.activityLevel
        );

      await updateProfile(editingProfile.id, {
        name: formData.name.trim(),
        age: parseInt(formData.age) || null,
        weight: parseFloat(formData.weight) || null,
        height: parseFloat(formData.height) || null,
        gender: formData.gender,
        activityLevel: formData.activityLevel,
        calorieGoal: parseInt(calorieGoal),
      });

      setModalVisible(false);
      setEditingProfile(null);
      resetForm();
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
      console.error('Error updating profile:', error);
    }
  };

  const handleDeleteProfile = (profile) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este perfil?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProfile(profile.id);
              Alert.alert('Éxito', 'Perfil eliminado correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el perfil');
              console.error('Error deleting profile:', error);
            }
          },
        },
      ]
    );
  };

  const handleSelectProfile = async (profile) => {
    try {
      await selectProfile(profile.id);
      Alert.alert('Éxito', `Perfil ${profile.name} seleccionado`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar el perfil');
      console.error('Error selecting profile:', error);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setEditingProfile(null);
    setModalVisible(true);
  };

  const openEditModal = (profile) => {
    setFormData({
      name: profile.name,
      age: profile.age?.toString() || '',
      weight: profile.weight?.toString() || '',
      height: profile.height?.toString() || '',
      gender: profile.gender || 'male',
      activityLevel: profile.activityLevel || 'moderate',
      calorieGoal: profile.calorieGoal?.toString() || '',
    });
    setEditingProfile(profile);
    setModalVisible(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      weight: '',
      height: '',
      gender: 'male',
      activityLevel: 'moderate',
      calorieGoal: '',
    });
  };

  const renderProfileItem = ({ item }) => (
    <View style={styles.profileCard}>
      <View style={styles.profileHeader}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{item.name}</Text>
          <Text style={styles.profileDetails}>
            Meta: {item.calorieGoal} kcal/día
          </Text>
          {item.age && (
            <Text style={styles.profileDetails}>
              {item.age} años
            </Text>
          )}
        </View>
        <View style={styles.profileActions}>
          {currentProfileId === item.id && (
            <View style={styles.activeIndicator}>
              <Text style={styles.activeText}>Activo</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.profileButtons}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            currentProfileId === item.id && styles.activeButton
          ]}
          onPress={() => handleSelectProfile(item)}
          disabled={currentProfileId === item.id}
        >
          <Text style={[
            styles.actionButtonText,
            currentProfileId === item.id && styles.activeButtonText
          ]}>
            {currentProfileId === item.id ? 'Seleccionado' : 'Seleccionar'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => openEditModal(item)}
        >
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteProfile(item)}
        >
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
            Eliminar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No hay perfiles</Text>
      <Text style={styles.emptySubtitle}>
        Crea tu primer perfil para comenzar a usar la aplicación
      </Text>
      <TouchableOpacity style={styles.createFirstButton} onPress={openCreateModal}>
        <Text style={styles.createFirstButtonText}>Crear Primer Perfil</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfiles</Text>
        <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
          <Text style={styles.addButtonText}>+ Agregar</Text>
        </TouchableOpacity>
      </View>

      {profiles.length > 0 ? (
        <FlatList
          data={profiles}
          renderItem={renderProfileItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButton}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingProfile ? 'Editar Perfil' : 'Nuevo Perfil'}
            </Text>
            <TouchableOpacity
              onPress={editingProfile ? handleUpdateProfile : handleCreateProfile}
            >
              <Text style={styles.saveButton}>
                {editingProfile ? 'Actualizar' : 'Crear'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nombre *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Ingresa tu nombre"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Edad (años)</Text>
              <TextInput
                style={styles.input}
                value={formData.age}
                onChangeText={(text) => setFormData({ ...formData, age: text })}
                placeholder="Ej: 25"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroupHalf}>
                <Text style={styles.label}>Peso (kg)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.weight}
                  onChangeText={(text) => setFormData({ ...formData, weight: text })}
                  placeholder="Ej: 70"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroupHalf}>
                <Text style={styles.label}>Altura (cm)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.height}
                  onChangeText={(text) => setFormData({ ...formData, height: text })}
                  placeholder="Ej: 170"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Género</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioOption,
                    formData.gender === 'male' && styles.radioOptionSelected
                  ]}
                  onPress={() => setFormData({ ...formData, gender: 'male' })}
                >
                  <Text style={[
                    styles.radioText,
                    formData.gender === 'male' && styles.radioTextSelected
                  ]}>
                    Masculino
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioOption,
                    formData.gender === 'female' && styles.radioOptionSelected
                  ]}
                  onPress={() => setFormData({ ...formData, gender: 'female' })}
                >
                  <Text style={[
                    styles.radioText,
                    formData.gender === 'female' && styles.radioTextSelected
                  ]}>
                    Femenino
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nivel de Actividad</Text>
              <View style={styles.activityOptions}>
                {[
                  { key: 'sedentary', label: 'Sedentario', desc: 'Poco o ningún ejercicio' },
                  { key: 'light', label: 'Ligero', desc: 'Ejercicio ligero 1-3 días/semana' },
                  { key: 'moderate', label: 'Moderado', desc: 'Ejercicio moderado 3-5 días/semana' },
                  { key: 'active', label: 'Activo', desc: 'Ejercicio intenso 6-7 días/semana' },
                  { key: 'veryActive', label: 'Muy Activo', desc: 'Ejercicio muy intenso o trabajo físico' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.activityOption,
                      formData.activityLevel === option.key && styles.activityOptionSelected
                    ]}
                    onPress={() => setFormData({ ...formData, activityLevel: option.key })}
                  >
                    <Text style={[
                      styles.activityLabel,
                      formData.activityLevel === option.key && styles.activityLabelSelected
                    ]}>
                      {option.label}
                    </Text>
                    <Text style={[
                      styles.activityDesc,
                      formData.activityLevel === option.key && styles.activityDescSelected
                    ]}>
                      {option.desc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Meta de Calorías (opcional)</Text>
              <TextInput
                style={styles.input}
                value={formData.calorieGoal}
                onChangeText={(text) => setFormData({ ...formData, calorieGoal: text })}
                placeholder="Se calculará automáticamente si se deja vacío"
                keyboardType="numeric"
              />
              <Text style={styles.helpText}>
                Si no especificas una meta, se calculará automáticamente basada en tus datos.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileAvatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  profileActions: {
    alignItems: 'flex-end',
  },
  activeIndicator: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  profileButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeButton: {
    backgroundColor: '#4CAF50',
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#F5F5F5',
  },
  actionButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  activeButtonText: {
    color: '#FFFFFF',
  },
  deleteButtonText: {
    color: '#F44336',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  createFirstButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  createFirstButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cancelButton: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  formGroup: {
    marginVertical: 12,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formGroupHalf: {
    flex: 0.48,
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  radioGroup: {
    flexDirection: 'row',
  },
  radioOption: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  radioOptionSelected: {
    backgroundColor: '#4CAF50',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  radioTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  activityOptions: {
    marginTop: 8,
  },
  activityOption: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  activityOptionSelected: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  activityLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  activityLabelSelected: {
    color: '#4CAF50',
  },
  activityDesc: {
    fontSize: 14,
    color: '#666',
  },
  activityDescSelected: {
    color: '#4CAF50',
  },
  helpText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default ProfileScreen;
