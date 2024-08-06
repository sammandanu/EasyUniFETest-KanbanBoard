<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Card {
  full_name: string
  email: string
}

interface Response {
  results: Card[]
}
interface Stage {
  id: number
  name: string
  header_color: string
  order: number
  cards: Card[]
}

const stages = ref<Stage[]>()

const getCardData = async (id: string) => {
  try {
    await import('@/mock/stage')
    const response = await axios.get(`/stage/${id}`)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

let draggedCard = ref<{ stageIndex: number; cardIndex: number } | null>(null)

const onDragStart = (event: DragEvent, stageIndex: number, cardIndex: number) => {
  draggedCard.value = { stageIndex, cardIndex }
}

const onDrop = (event: DragEvent, stageIndex: number, cardIndex: number | null) => {
  if (draggedCard.value && stages.value) {
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

const getStages = async () => {
  try {
    await import('@/mock/stages')
    const response = await axios.get('/stages')
    stages.value = response.data.results

    if (stages.value && stages.value.length > 0) {
      stages.value.forEach(async (data) => {
        const res: Response = await getCardData(data.id.toString())
        if (res) {
          data.cards = res.results
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}
// setData()
onMounted(async () => {
  getStages()
})
</script>
<template>
  <div class="kanban-board flex overflow-x-auto p-4 overflow-y-hidden max-h-dvh">
    <div
      v-for="(stage, index) in stages"
      :key="index"
      class="kanban-stage flex-shrink-0 w-72 p-4 bg-gray-100 rounded-lg m-2 flex flex-col gap-2 overflow-y-hidden"
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
