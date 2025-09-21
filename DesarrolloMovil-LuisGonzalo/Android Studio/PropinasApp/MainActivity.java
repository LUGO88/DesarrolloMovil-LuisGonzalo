package com.example.propinasapp;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

  EditText monto;
  EditText personas;
  RadioButton propina1;
  RadioButton propina2;
  RadioButton propina3;
  Button calcular;
  TextView res;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    EdgeToEdge.enable(this);
    setContentView(R.layout.activity_main);

    // Vincular vistas con sus IDs
    monto = findViewById(R.id.monto);
    personas = findViewById(R.id.personas);
    propina1 = findViewById(R.id.propina1);
    propina2 = findViewById(R.id.propina2);
    propina3 = findViewById(R.id.propina3);
    calcular = findViewById(R.id.calcular);
    res = findViewById(R.id.res);

    // Acción del botón calcular
    calcular.setOnClickListener(v -> {
      try {
        double montoTotal = Double.parseDouble(monto.getText().toString());
        int numPersonas = Integer.parseInt(personas.getText().toString());

        if (numPersonas <= 0) {
          Toast.makeText(this, "Número de personas debe ser mayor a 0", Toast.LENGTH_SHORT).show();
          return;
        }

        double porcentaje = 0;
        if (propina1.isChecked()) {
          porcentaje = 0.05;
        } else if (propina2.isChecked()) {
          porcentaje = 0.10;
        } else if (propina3.isChecked()) {
          porcentaje = 0.15;
        } else {
          Toast.makeText(this, "Selecciona un porcentaje de propina", Toast.LENGTH_SHORT).show();
          return;
        }

        // Calcular total con propina
        double totalConPropina = montoTotal + (montoTotal * porcentaje);
        // Dividir entre personas
        double porPersona = totalConPropina / numPersonas;

        // Mostrar resultado
        res.setText("Total con propina: $" + String.format("%.2f", totalConPropina) +
          "\nCada persona paga: $" + String.format("%.2f", porPersona));

      } catch (Exception e) {
        Toast.makeText(this, "Completa todos los campos correctamente", Toast.LENGTH_SHORT).show();
      }
    });
  }
}

