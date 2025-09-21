package com.example.splashscreen;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class MainActivity extends AppCompatActivity {

  Animation akaza1, tanjiro1;

  ImageView imgAkaza1, imgTanjiro1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);


        akaza1 = AnimationUtils.loadAnimation(this,R.anim.akaza1_anim);
        tanjiro1 = AnimationUtils.loadAnimation(this,R.anim.tanjiro1_anim);
        imgAkaza1 = findViewById(R.id.p1);
        imgTanjiro1 = findViewById(R.id.p2);

        imgAkaza1.startAnimation(akaza1);
        imgTanjiro1.startAnimation(tanjiro1);

        /*Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
          @Override
          public void run() {

          }
        },1500);*/

      startActivity(new Intent(MainActivity.this, MainActivity2.class));




    }
}
