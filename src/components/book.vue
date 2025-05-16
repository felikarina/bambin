<script setup lang="ts"></script>
<template>
  <div class="gallery">
    <div class="fixed-grid has-1-cols">
      <div class="grid">
        <div class="cell">
          <div class="card my-4">
            <div class="card-header">
              <p class="card-header-title">Mercredi 4 - Matin</p>
            </div>
            <div class="card-content">
              <div class="content has-text-weight-semibold">
                <h1>Peinture sensorielle</h1>
                Aujourd'hui, nous avons proposé aux enfants une activité qu'on appelle la peinture
                propre, on place quelques touches de peinture sur une feuille blanche, qu'on glisse
                ensuite dans une pochette plastique bien fermée avec de l’adhésif. Les enfants
                peuvent alors appuyer, étaler, tracer avec leurs petits doigts à travers le
                plastique, en toute sécurité et sans se salir. C’est un vrai moment de découverte
                sensorielle, et chacun crée son œuvre à sa manière, avec beaucoup de curiosité et
                d’émerveillement.
              </div>
            </div>
          </div>
        </div>
        <div class="cell">
          <div class="card my-4">
            <div class="card-header">
              <p class="card-header-title">Mercredi 4 - Matin</p>
            </div>
            <div class="card-content">
              <div class="content has-text-weight-semibold">
                <h1>Transvasement</h1>
                Avec plusieurs contenants de différentes tailles et formes, les enfants étaient
                invités à déverser de l’eau d’un bac à un. Ils ont pu observer les différences de
                poids, de volume et de forme. Ils ont aussi pu observer que l’eau ne se mélange pas
                avec l’huile, et que les deux liquides ne se mélangent pas. Ils ont aussi pu
                observer que l’eau ne se mélange pas avec l’huile, et que les deux liquides ne se
                mélangent pas.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.gallery {
  background-color: var(--blue-lighter);
  border-radius: 20px;
}

.cell {
  padding: 4%;
}

.card {
  background-color: var(--blue-light);
}

.card-content {
  background-color: white;
}

.card-content h1 {
  color: var(--primary);
}
.content {
  color: black;
}

p {
  color: black;
}
</style>
