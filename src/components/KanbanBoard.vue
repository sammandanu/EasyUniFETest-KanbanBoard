<script lang="ts" setup>
import { ref } from 'vue'
import Stage from '@/json/stages.json'
import Data1 from '@/json/contacts-stage-018f3d6c-74b0-76ee-8896-ec7d51d576df.json'
import Data2 from '@/json/contacts-stage-018f3d6b-a5b7-7124-b0d0-cf5a081f869b.json'
import Data3 from '@/json/contacts-stage-018f3d6b-335e-7c8e-b5c7-7792b3ee9f15.json'
console.log('Data1', Data1)

interface Card {
  full_name: string
  email: string
}

interface Stage {
  id: number
  name: string
  header_color: string
  order: number
  cards: Card[]
}

const stages = ref<Stage[]>(
  Stage.results.map((stage: any) => {
    return {
      id: stage.id,
      name: stage.name,
      header_color: stage.header_color,
      order: stage.order,
      cards: []
    }
  })
)

const setData = () => {
  Data1.results.forEach((card: any) => {
    const stage = stages.value.find((stage) => stage.id === card.stage)
    if (stage) {
      stage.cards.push(card)
    }
  })
  Data2.results.forEach((card: any) => {
    const stage = stages.value.find((stage) => stage.id === card.stage)
    if (stage) {
      stage.cards.push(card)
    }
  })
  Data3.results.forEach((card: any) => {
    const stage = stages.value.find((stage) => stage.id === card.stage)
    if (stage) {
      stage.cards.push(card)
    }
  })
}

let draggedCard = ref<{ stageIndex: number; cardIndex: number } | null>(null)

const onDragStart = (event: DragEvent, stageIndex: number, cardIndex: number) => {
  draggedCard.value = { stageIndex, cardIndex }
}

const onDrop = (event: DragEvent, stageIndex: number, cardIndex: number | null) => {
  if (draggedCard.value) {
    const { stageIndex: fromStageIndex, cardIndex: fromCardIndex } = draggedCard.value
    const card = stages.value[fromStageIndex].cards.splice(fromCardIndex, 1)[0]
    if (cardIndex === null) {
      stages.value[stageIndex].cards.push(card)
    } else {
      stages.value[stageIndex].cards.splice(cardIndex, 0, card)
    }
    draggedCard.value = null
  }
}

setData()
</script>
<template>
  <div class="kanban-board flex overflow-x-auto p-4 overflow-y-hidden max-h-dvh">
    <div
      v-for="(stage, index) in stages"
      :key="index"
      class="kanban-stage flex-shrink-0 w-64 p-4 bg-gray-100 rounded-lg m-2 flex flex-col gap-2 overflow-y-hidden"
      @dragover.prevent
      @drop="onDrop($event, index, null)"
    >
      <h2
        class="text-lg font-bold mb-4 p-4 rounded-lg"
        :style="`background-color: ${stage.header_color};`"
      >
        {{ stage.name }}
      </h2>

      <div class="flex flex-col overflow-auto">
        <div
          v-for="(card, cardIndex) in stage.cards"
          :key="cardIndex"
          class="kanban-card p-4 mb-2 bg-white rounded-lg shadow-md"
          draggable="true"
          @dragstart="onDragStart($event, index, cardIndex)"
          @dragover.prevent
          @drop="onDrop($event, index, cardIndex)"
        >
          <div class="">
            {{ card.full_name }}
          </div>
          <div class="text-sm truncate">{{ card.email }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kanban-board {
  scroll-snap-type: x mandatory;
}

.kanban-stage {
  scroll-snap-align: start;
}

.kanban-card {
  transition: transform 0.2s ease-in-out;
}

.kanban-card:active {
  transform: scale(1.05);
}
</style>
