import { defineStore } from 'pinia'
import axios from 'axios'

interface StockData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export const useStockStore = defineStore('stock', {
  state: () => ({
    stockData: [] as StockData[],
    loading: false,
    error: null as string | null,
    currentSymbol: '',
    currentRange: 'month'
  }),
  actions: {
    async fetchStockData(symbol: string, range: string) {
      this.loading = true
      this.error = null
      this.currentSymbol = symbol
      this.currentRange = range
      
      try {
        const response = await axios.get(`/api/stocks/${symbol}`, {
          params: { range }
        })
        this.stockData = response.data
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch stock data'
      } finally {
        this.loading = false
      }
    },
    async refreshStockData() {
      if (!this.currentSymbol) return
      
      this.loading = true
      this.error = null
      
      try {
        await axios.post(`/api/stocks/${this.currentSymbol}/refresh`)
        // After refresh, fetch the data again
        await this.fetchStockData(this.currentSymbol, this.currentRange)
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to refresh stock data'
      } finally {
        this.loading = false
      }
    }
  }
})