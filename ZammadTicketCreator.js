/**
 * The Zammad Ticket Creator creates an Object initialized with the URL of the desired Zammad instance, a fingerprint for safety reasons and a source which may be the form name.
 * The resulting object has a send function which gets the config necessary from the Zammad instance and sends a Post request to the API endpoint.
 * Optional: a setWaiting function can be passed to the send function to display a loading screen.
 * @author relivnd
 * @param {string} serverUrl
 * @param {string} fingerprint
 * @param {string} source
 */
class ZammadTicketCreator {

    /**
     * represents ticket creator
     * @constructor
     * @param {string} serverUrl
     * @param {string} fingerprint
     * @param {string} source
     */
    constructor(serverUrl, fingerprint, source) {
        this.serverUrl = serverUrl;
        this.fingerprint = fingerprint;
        this.source = source;
    }

    /**
     *
     * @param name
     * @param email
     * @param payload
     * @param waitingFunc
     */
    send (name = "No Name Provided", email = "no@email.prov", payload = {body: "nothing"}, waitingFunc) {

        /**
         * calls waitingFunc parameter if waiting Function is provided
         * @param param
         */
        const setWaiting = (param) => {
            if (waitingFunc !== undefined){
                waitingFunc(param)
            }
        }

        /**
         * Set waiting function to true, receive Zammad Config and submit payload
         * @param payload
         */
        const zsubmit = payload => {
            setWaiting(true);
            getZammadConfig(this.serverUrl, this.fingerprint).then(res=>{
                zammadSubmit(res, payload, this.source, this.fingerprint).then(result=>{
                    console.debug(result);
                    if('ticket' in result){
                        console.debug("Success");
                    } else {
                        console.error(result);
                    }
                });
            });
            setWaiting(false);
        };

        /**
         * Receive Zammad Configuration from api endpoint
         * @param server
         * @param fingerprint
         * @returns {Promise<any>}
         */
        async function getZammadConfig(server, fingerprint){
            const response = await fetch(server+'/api/v1/form_config' ,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fingerprint: fingerprint
                }),
            });

            return response.json();
        }

        /**
         * async function which posts the payload to api endpoint
         * @param config
         * @param payload
         * @param source
         * @param fingerprint
         * @returns {Promise<void>}
         */
        async function zammadSubmit(config, payload, source, fingerprint){
            if (!config.enabled){
                console.error("Server reports form Submission disabled! ")
            }
            const response = await fetch(config.endpoint,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    body: payload,
                    title: source,
                    fingerprint: fingerprint,
                    token: config.token
                })
            });
            return response.json();
        }

        zsubmit(payload);
    }
}

module.exports = ZammadTicketCreator