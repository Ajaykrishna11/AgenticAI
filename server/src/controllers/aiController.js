import { orchestratorAgent } from '../agents/orchestratorAgent.js';

export const scanProduct = async (req, res) => {
  try {
    const file = req.file;
    const { rawTextOverride } = req.body;

    if (!file && !rawTextOverride) {
      return res.status(400).json({
        success: false,
        message: 'Please select an image file or provide text to scan.'
      });
    }

    const result = await orchestratorAgent.runScanPipeline(
      req.user?._id || null,
      file,
      rawTextOverride
    );

    res.json({
      success: true,
      message: 'AI Processing completed successfully.',
      data: result.extractedProduct,
      pipelineAudit: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error occurred during AI scan pipeline execution.'
    });
  }
};
