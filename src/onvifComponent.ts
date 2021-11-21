/**
 * Base component for future shared functionality
 */
export abstract class OnvifComponent {

    /**
     * Cleans up the component
     * @returns {Promise<void>} resolved when dispose operation is finished
     */
    abstract dispose(): Promise<void>;
}