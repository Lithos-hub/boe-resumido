<template>
  <div v-if="stats">
    <small>Aspectos positivos, negativos y neutros del boletín:</small>
    <div class="h-auto py-5">
      <Pie :data :options />
    </div>
  </div>
  <div v-else>
    <p class="text-red-500">
      No se han podido obtener las estadísticas del boletín.
    </p>
  </div>
</template>

<script setup lang="ts">
import { Pie } from 'vue-chartjs';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
} from 'chart.js';
import type { StatsProps } from './Stats.interfaces';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps<StatsProps>();

const data: ChartData<'pie'> = {
  labels: ['Positivo', 'Negativo', 'Neutral'],
  datasets: [
    {
      label: 'Cantidad',
      data: [
        props.stats?.positive ?? 0,
        props.stats?.negative ?? 0,
        props.stats?.neutral ?? 0,
      ],
      backgroundColor: ['#22c55e', '#f43f5e', '#71717a'],
      borderWidth: 5,
      borderColor: ['#1D1C2B', '#1D1C2B', '#1D1C2B'],
    },
  ],
};

const options: ChartOptions<'pie'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: 'white',
        font: {
          size: 10,
        },
      },
      position: 'top',
    },
  },
};
</script>
