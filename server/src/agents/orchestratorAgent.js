import { AgentLog } from '../models/AgentLog.js';
import { scanningAgent } from './scanningAgent.js';
import { categoryAgent } from './categoryAgent.js';
import { inventoryAgent } from './inventoryAgent.js';
import { expiryAgent } from './expiryAgent.js';
import { notificationAgent } from './notificationAgent.js';
import { recommendationAgent } from './recommendationAgent.js';

export const orchestratorAgent = {
  name: 'ORCHESTRATOR_AGENT',

  /**
   * Main scan-to-inventory pipeline orchestration
   */
  async runScanPipeline(userId, fileMulter, rawTextOverride = null) {
    try {
      // Step 1: Execute Scanning Agent
      const scanResult = await scanningAgent.processImage(fileMulter, rawTextOverride);
      await this.logActivity(userId, scanningAgent.name, 'PROCESS_IMAGE_OCR', { file: fileMulter?.originalname }, scanResult);

      // Step 2: Execute Category Agent
      const categoryResult = categoryAgent.classifyProduct({
        productName: scanResult.productName,
        rawText: scanResult.rawText
      });
      await this.logActivity(userId, categoryAgent.name, 'CLASSIFY_CATEGORY', { productName: scanResult.productName }, categoryResult);

      // Step 3: Execute Inventory Agent (Check for duplicate items)
      const inventoryCheck = await inventoryAgent.checkExistingInventory(userId, {
        productName: scanResult.productName,
        brand: scanResult.brand
      });
      await this.logActivity(userId, inventoryAgent.name, 'CHECK_DUPLICATES', { productName: scanResult.productName }, inventoryCheck);

      const aggregatedResult = {
        scanning: scanResult,
        classification: categoryResult,
        duplicateCheck: inventoryCheck,
        extractedProduct: {
          productName: scanResult.productName,
          brand: scanResult.brand,
          category: categoryResult.category,
          subcategory: categoryResult.subcategory,
          manufacturingDate: scanResult.manufacturingDate,
          expiryDate: scanResult.expiryDate,
          recommendedLocation: categoryResult.recommendedLocation,
          quantity: 1,
          unit: 'pcs',
          confidenceScore: Math.min(scanResult.confidence, categoryResult.confidenceScore),
          rawOcrText: scanResult.rawText
        }
      };

      await this.logActivity(userId, this.name, 'PIPELINE_SCAN_COMPLETE', { file: fileMulter?.originalname }, { status: 'SUCCESS' });

      return aggregatedResult;
    } catch (error) {
      await this.logActivity(userId, this.name, 'PIPELINE_SCAN_ERROR', {}, { error: error.message }, 'FAILED');
      throw error;
    }
  },

  /**
   * Run daily expiry check pipeline
   */
  async runExpiryMonitoringPipeline(userId = null) {
    try {
      const scanResult = await expiryAgent.runDailyExpiryScan(userId);
      await this.logActivity(userId, expiryAgent.name, 'RUN_DAILY_EXPIRY_SCAN', { targetUserId: userId }, scanResult);
      return scanResult;
    } catch (error) {
      await this.logActivity(userId, this.name, 'EXPIRY_SCAN_ERROR', {}, { error: error.message }, 'FAILED');
      throw error;
    }
  },

  async logActivity(userId, agentName, action, inputData, outputData, status = 'SUCCESS') {
    try {
      await AgentLog.create({
        userId: userId || null,
        agentName,
        action,
        inputData,
        outputData,
        status
      });
    } catch (e) {
      console.warn(`[AgentLog Error]: Failed to write activity log (${e.message})`);
    }
  }
};
