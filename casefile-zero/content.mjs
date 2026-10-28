// Original educational text and deliberately inert lab specimens.
// OWASP Top 10:2025 categories: https://top10.owasp.org/2025/
// TTP vocabulary: https://attack.mitre.org/resources/faq/
export const chapters = [
{
 id:'a01',code:'A01:2025',title:'Broken Access Control',short:'Who is allowed to see this?',sector:'IDENTITY',accent:'#cc7655',difficulty:'FOUNDATION',time:12,
 lead:'The server must decide whether a user can perform a particular action on a particular object. Hiding a button in the browser is not authorization.',
 story:'You are reviewing the invoice endpoint for a small SaaS company. A signed-in customer changes the invoice number in a request. The page returns an invoice belonging to a different customer.',
 principle:'Authentication tells the app who you are. Authorization decides what you can do. An object ownership check must happen on every server request.',
 analogy:'A hotel key proves you are a guest; it does not grant access to every room.',
 stages:[['01 / REQUEST','An authenticated customer asks for /api/invoices/1024.'],['02 / REFERENCE','The server loads invoice 1024 using the ID from the URL.'],['03 / TRUST BOUNDARY','The handler forgets to compare invoice.customer_id with the current customer.'],['04 / OUTCOME','An unrelated invoice is returned. A per-object ownership check blocks it.']],
 observe:'Look for a successful 200 response to a resource not owned by the requesting identity, or missing object-level authorization in the handler.',
 controls:['Derive the active user identity from a verified server session.','Apply a deny-by-default authorization check to every object and action.','Test horizontal and vertical privilege boundaries separately.','Log authorization failures without leaking restricted records.'],
 gotcha:'Guessing or changing IDs is not itself a vulnerability. The failure is the server releasing an unauthorized object.',
 specimen:['id-change','role-parameter','local-url'],
 questions:[
 ['A logged-in user can fetch a different account’s invoice. What is the first missing safeguard?',['Server-side object ownership check','A harder-to-guess invoice ID','A different button color','Client-side route guard'],0,'IDs and hidden UI are not access-control checks. The server must check the object against the requester.'],
 ['Which test best proves horizontal access control works?',['Try a second valid customer account against the first account’s object','Sign out and reopen the homepage','Check that the login page uses HTTPS','Rename the URL parameter'],0,'Horizontal access control compares two identities with the same role but different resource ownership.'],
 ['What would prevent a role field in a request body from granting administrative access?',['Derive role permissions from trusted server-side identity','Base64-encode the role field','Show an admin-only menu in CSS','Use a longer URL'],0,'The client cannot assign its own privileges; authorization decisions need trusted server state.']]
},
{
 id:'a02',code:'A02:2025',title:'Security Misconfiguration',short:'The dangerous default.',sector:'CONFIGURATION',accent:'#cb9b59',difficulty:'FOUNDATION',time:10,
 lead:'Secure code can still be exposed by debug modes, broad permissions, sample accounts, weak headers, or services that were never meant to be public.',
 story:'A staging deployment accidentally exposes a debugging endpoint and uses a permissive CORS response. Your job is to identify what is trusted and what needs to change.',
 principle:'Configuration is part of the security boundary. Set safe defaults, restrict exposure, and verify the effective deployment configuration.',
 analogy:'A well-built safe is still unsafe if the installer leaves its door open.',
 stages:[['01 / DEPLOY','An application is deployed with development settings.'],['02 / EXPOSURE','A debugging endpoint and permissive origin policy remain enabled.'],['03 / REQUEST','A browser or outside user reaches an unintended surface.'],['04 / HARDEN','A configuration baseline removes debug access and restricts trusted origins.']],
 observe:'Unexpected public routes, wildcard policies used with sensitive APIs, verbose error details, exposed admin consoles, and default credentials.',
 controls:['Disable debugging and example endpoints outside controlled development.','Apply restrictive CORS and security-header policies based on actual origin needs.','Store configuration as reviewed, tested infrastructure code.','Scan deployed settings and periodically compare them with a baseline.'],
 gotcha:'A wildcard Access-Control-Allow-Origin header is not, by itself, proof of a data breach; response credentials and endpoint sensitivity matter.',
 specimen:['cors','debug','directory-index'],
 questions:[
 ['Which action directly reduces the risk of an exposed production debug route?',['Disable or restrict debug endpoints in the production configuration','Obfuscate route names in JavaScript','Hide the button from navigation','Shorten error messages only in CSS'],0,'Configuration should prevent the endpoint from being reachable by unintended clients.'],
 ['What should a secure deployment pipeline compare?',['Effective settings against a reviewed hardening baseline','Only the homepage loading speed','Only the frontend bundle size','Only the color palette'],0,'A deployed system can drift from its approved settings even if its source code has not changed.'],
 ['Which CORS statement is accurate?',['The risk depends on allowed origins, credentials, and sensitive response data','Any wildcard header always leaks cookies','CORS protects APIs from all non-browser requests','CORS replaces user authorization'],0,'CORS is a browser access policy and cannot substitute for authentication or authorization.']]
},
{
 id:'a03',code:'A03:2025',title:'Software Supply Chain Failures',short:'Can you trust the build?',sector:'DEPENDENCIES',accent:'#8f9fbf',difficulty:'INTERMEDIATE',time:11,
 lead:'Compromise can enter through a dependency, maintainer account, build environment, package registry, or release pipeline rather than a request parameter.',
 story:'An application dependency is updated during CI. The commit did not change application code, but the build now pulls an unexpected package version.',
 principle:'Treat dependencies and build artifacts as untrusted inputs. Use pinned, reviewed versions, provenance, limited CI permissions, and repeatable builds.',
 analogy:'A clean kitchen cannot guarantee safe food if the ingredients arrive compromised.',
 stages:[['01 / SOURCE','A project declares a dependency.'],['02 / RESOLVE','CI resolves a new package version from a registry.'],['03 / BUILD','Installation scripts and build tools run with permissions.'],['04 / VERIFY','Lockfiles, trusted registries, review, provenance and restricted tokens reduce the blast radius.']],
 observe:'Unexpected lockfile changes, package name lookalikes, new install scripts, unsigned releases or workflow permissions that exceed build requirements.',
 controls:['Review and lock dependency versions, including transitive dependencies.','Use vetted registries and dependency scanning with human review.','Restrict CI secrets and job permissions; isolate untrusted pull requests.','Record source and build provenance for released artifacts.'],
 gotcha:'A vulnerability scan is a useful signal, not proof a complete supply chain is safe.',
 specimen:['dependency','workflow','artifact'],
 questions:[
 ['A build suddenly downloads a different transitive dependency. Where should the team investigate first?',['Lockfile changes, package provenance and registry source','End-user browser cache only','The CSS animation settings','The keyboard shortcuts'],0,'The dependency resolution path can change what code executes during installation and build.'],
 ['Which CI practice limits damage from a malicious dependency install step?',['Use narrowly scoped permissions and do not expose production secrets','Grant write access to all jobs for convenience','Disable all build logs','Reuse the same unrestricted token everywhere'],0,'Least-privilege jobs reduce the impact of code running during a compromised build.'],
 ['What is the role of a software bill of materials (SBOM)?',['Provide an inventory of components used in a build','Prove all installed packages are secure','Replace dependency review with a hash','Encrypt every dependency automatically'],0,'An SBOM makes component tracking easier but does not certify that components are safe.']]
},
{
 id:'a04',code:'A04:2025',title:'Cryptographic Failures',short:'Protection that stops too early.',sector:'CRYPTOGRAPHY',accent:'#88afa9',difficulty:'INTERMEDIATE',time:12,
 lead:'Cryptography fails when sensitive data is sent in cleartext, keys are mishandled, outdated constructions are used, or encryption is mistaken for complete access control.',
 story:'A service has a login endpoint with HTTPS, but a separate internal API logs full session tokens and stores user passwords using a fast unsalted hash.',
 principle:'Match the protection to the asset. Use vetted cryptographic libraries, TLS where needed, password-specific hashing, and key lifecycle management.',
 analogy:'A locked delivery truck is not enough if you copy the key on every package label.',
 stages:[['01 / SECRET','A user submits a password or token.'],['02 / TRANSIT','TLS protects the request in transport.'],['03 / STORAGE','The service must still hash passwords appropriately and protect tokens in logs.'],['04 / REVIEW','Secure retention, rotation and algorithm choices complete the picture.']],
 observe:'Plaintext secrets in logs, HTTP endpoints for private data, password hashes based on a generic fast digest, reused/non-rotated keys.',
 controls:['Use HTTPS with modern TLS and correct certificate validation.','Store passwords with Argon2id, scrypt, or an appropriate bcrypt configuration.','Use maintained crypto libraries; never invent ciphers or key exchange.','Keep tokens and keys out of logs, source history and public bundles.'],
 gotcha:'Base64 is encoding, not encryption. A checksum is not a password storage scheme.',
 specimen:['base64','weak-hash','cleartext'],
 questions:[
 ['Which approach is appropriate for storing account passwords?',['A password-specific salted hash such as Argon2id','Reversible Base64 encoding','A plain SHA-256 digest without a salt','AES encryption with a key hardcoded in the frontend'],0,'Password hashes need intentionally expensive, salted verification, not reversible encoding.'],
 ['A login uses HTTPS but prints session tokens in application logs. What failed?',['Sensitive-token handling after transport decryption','Only certificate pinning','The browser address bar','The server DNS record'],0,'TLS protects transit, not every copy of a secret after it reaches the server.'],
 ['Which statement about Base64 is true?',['It transforms bytes into a printable representation and does not provide secrecy','It securely encrypts passwords','It supplies message authentication','It prevents token replay'],0,'Anybody with the value can decode it; Base64 has no secret key.']]
},
{
 id:'a05',code:'A05:2025',title:'Injection',short:'When data becomes instructions.',sector:'INPUT HANDLING',accent:'#db7655',difficulty:'INTERMEDIATE',time:15,
 lead:'Injection happens when untrusted input crosses from data into a command or interpreter context: SQL, HTML, shell, templates, LDAP, and more.',
 story:'A search endpoint concatenates user input into SQL. A second page reflects a user-provided greeting into HTML. Each path crosses a different interpreter boundary.',
 principle:'Separate instructions from data. Use prepared statements, context-specific output encoding, safe APIs and allowlists where appropriate.',
 analogy:'A restaurant order note should never be allowed to rewrite the kitchen’s operating procedures.',
 stages:[['01 / INPUT','A user submits search, URL or form input.'],['02 / JOIN','A vulnerable handler combines data with an interpreter’s instructions.'],['03 / PARSE','The database, shell or browser may treat that data as executable syntax.'],['04 / ISOLATE','Parameters, escaping by output context and safe APIs preserve the data/instruction boundary.']],
 observe:'Unsafely concatenated SQL strings, innerHTML usage on untrusted text, shell command string construction and unexpected parser errors.',
 controls:['Use prepared SQL parameters; do not concatenate SQL fragments from user input.','Encode HTML output for the actual sink; prefer textContent for text.','Avoid shell interpolation; pass argument arrays to system APIs.','Apply allowlists to commands, templates and file paths where applicable.'],
 gotcha:'One filter does not fix all injection types. SQL parameterization does not fix XSS; HTML encoding does not fix shell injection.',
 specimen:['sqli-quote','sqli-boolean','xss-tag','xss-attribute','cmd-echo','ssti'],
 questions:[
 ['What specifically prevents a SQL value from changing a query’s syntax?',['A prepared statement with bound parameters','Escaping angle brackets in HTML','A longer column name','Moving the query into frontend JavaScript'],0,'Bound parameters are parsed as data rather than executable SQL syntax.'],
 ['Which browser API is the safer default for showing untrusted plain text?',['textContent','innerHTML','document.write','insertAdjacentHTML'],0,'textContent treats its input as text rather than interpreting HTML markup.'],
 ['Why might SQL parameterization fail to prevent XSS?',['The vulnerabilities cross different interpreter boundaries','SQL queries are always safe in browsers','XSS only occurs in database engines','Prepared statements disable JavaScript everywhere'],0,'SQL parameter binding and browser output encoding solve different problems.']]
},
{
 id:'a06',code:'A06:2025',title:'Insecure Design',short:'A missing rule, not a missing patch.',sector:'THREAT MODELING',accent:'#b09dbd',difficulty:'INTERMEDIATE',time:11,
 lead:'A design can be insecure even if every line of code implements the original specification correctly. A missing business rule may create abuse opportunities.',
 story:'A coupon redemption service allows unlimited redemptions per user because nobody specified a per-account limit or a concurrency rule.',
 principle:'Security requirements, abuse cases, trust boundaries and failure-mode assumptions must be designed before implementation.',
 analogy:'A turnstile with flawless bearings still fails if everyone can enter through an unguarded side door.',
 stages:[['01 / REQUIREMENT','A feature is specified without an abuse limit.'],['02 / BUILD','Developers implement the stated requirement exactly.'],['03 / ABUSE','Automation repeatedly redeems the same benefit.'],['04 / DESIGN FIX','Define a one-time rule, atomic state update and abuse monitoring.']],
 observe:'Missing limits, unconsidered states, money-related race conditions, unsafe recovery paths and absent business invariants.',
 controls:['Threat-model the feature and write explicit abuse cases.','Define server-side business invariants, limits and ownership rules.','Use atomic operations for state changes such as redemption.','Test unhappy paths and abuse sequences, not just normal workflows.'],
 gotcha:'Rate limiting can reduce abuse, but a one-per-account business rule requires stateful server-side enforcement.',
 specimen:['coupon','race','insecure-flow'],
 questions:[
 ['A coupon is reusable because no one specified a redemption limit. What is the root issue?',['An absent security requirement in the workflow design','Only a misspelled error message','A poor choice of font','The customer using two browser tabs'],0,'The software may do exactly what it was designed to do, but the design omitted an abuse prevention rule.'],
 ['Which fix addresses repeated coupon use despite concurrent requests?',['An atomic server-side redemption constraint','Disable the button after clicking','Add a spinner in the UI','Hide the endpoint name'],0,'Concurrent requests require a server-enforced invariant, not a client-side convenience.'],
 ['Which input is most useful before designing a money-transfer feature?',['Abuse cases and invariants for balances, ownership and replay','A production error screenshot only','A list of preferred button shapes','A faster animation library'],0,'Threat modeling should identify what must always remain true about an operation.']]
},
{
 id:'a07',code:'A07:2025',title:'Authentication Failures',short:'When identity proof is too weak.',sector:'SESSIONS',accent:'#b89660',difficulty:'INTERMEDIATE',time:12,
 lead:'Authentication can fail through predictable recovery tokens, missing throttling, weak session handling or login flows that trust the wrong identifier.',
 story:'A password-reset URL contains a short reusable token and remains valid after a password is changed. A user who saved that link can reuse it.',
 principle:'Treat password reset as authentication. Tokens need adequate entropy, expiry, single use, and invalidation when state changes.',
 analogy:'Replacing a door lock should invalidate the old spare key.',
 stages:[['01 / REQUEST','A user starts password recovery.'],['02 / TOKEN','The service creates a reset token and delivers it through a protected channel.'],['03 / REDEEM','The user submits the token; the server verifies expiry and one-time use.'],['04 / REVOKE','Successful reset invalidates the token and reviews existing sessions.']],
 observe:'Repeated use of reset links, weak account lockout strategies, session IDs in URLs, tokens without expiry, missing MFA for sensitive actions.',
 controls:['Use random, single-use, short-lived recovery tokens stored safely.','Apply adaptive rate controls without making account enumeration easier.','Rotate sessions on authentication changes and secure cookie attributes.','Require stronger reauthentication or MFA for sensitive flows.'],
 gotcha:'Authentication is distinct from authorization: a valid identity still needs permission to access every resource.',
 specimen:['reset-token','session-url','login-rate'],
 questions:[
 ['A password-reset token still works after its first use. What is missing?',['Single-use invalidation on the server','An image CAPTCHA on the profile page','A stronger button style','Longer email subject lines'],0,'Recovery links are credentials and must be invalidated after redemption.'],
 ['What should a service do when a user signs in successfully?',['Rotate the session identifier and apply secure cookie settings','Keep the anonymous session identifier forever','Include session tokens in shareable URLs','Disable authorization checks'],0,'Rotating sessions limits fixation risks and secure cookies help protect credentials in transit and browser contexts.'],
 ['What is the value of MFA for a privileged account?',['It adds independent evidence beyond a stolen password','It removes the need for authorization checks','It guarantees the device has no malware','It encrypts every stored record'],0,'MFA adds another authentication factor but does not replace other security controls.']]
},
{
 id:'a08',code:'A08:2025',title:'Software or Data Integrity Failures',short:'Was this artifact altered?',sector:'INTEGRITY',accent:'#8ba8aa',difficulty:'ADVANCED',time:12,
 lead:'Integrity is the question of whether code, configuration or data was changed without authorization. It matters in downloads, updates and deserialization boundaries.',
 story:'An application downloads a policy file from an internal URL and applies it. The system has no signed or trusted reference for what the policy should contain.',
 principle:'Do not trust data because it has the right filename or arrived from an expected path. Validate provenance and integrity before acting on it.',
 analogy:'A sealed envelope from an unknown sender is not proof that its contents are authorized.',
 stages:[['01 / ARTIFACT','A client receives an update, policy file or serialized data.'],['02 / TRUST','The client assumes the artifact has not changed.'],['03 / EXECUTE','Modified behavior or data may be applied to the running system.'],['04 / VERIFY','A trusted digest or signature and a verified source protect the update path.']],
 observe:'Unsigned updates, untrusted serialized object handling, integrity checks that trust attacker-supplied hashes and unchecked policy files.',
 controls:['Verify signatures using trusted keys, or digests from a trusted separate channel.','Use safe serialization formats and strict schemas instead of unsafe object deserialization.','Protect artifact stores and deployment approvals with least privilege.','Record integrity verification failures and fail closed for sensitive updates.'],
 gotcha:'A hash delivered alongside a tampered file from the same untrusted source does not establish authenticity.',
 specimen:['hash-sidecar','deserialize','update'],
 questions:[
 ['Why is a SHA-256 file hash from the same untrusted server not enough?',['An attacker can alter both the file and its reported hash','SHA-256 is not a real hash function','Hashes automatically encrypt data','The browser cannot read any file hashes'],0,'Integrity needs a trustworthy reference value or signature, not just any computed digest.'],
 ['Which option is safer when consuming untrusted structured input?',['Parse a simple data format against a strict schema','Deserialize arbitrary objects with executable hooks','Execute serialized content to validate its syntax','Load classes named by the sender'],0,'Strict schemas reduce the chance that untrusted data becomes code or unexpected object behavior.'],
 ['A release signature validates but the signing key was compromised. What does the signature establish?',['The artifact matches the key, not that the key is trustworthy','The package contains no bugs','The code can never be changed again','The library is legally compliant'],0,'Signatures need a trusted signing key and key management process to provide meaningful provenance.']]
},
{
 id:'a09',code:'A09:2025',title:'Security Logging and Alerting Failures',short:'A signal no one notices.',sector:'DETECTION',accent:'#8fae89',difficulty:'FOUNDATION',time:11,
 lead:'A security event can be technically logged and still go undetected when the logs lack context, are lost, or never trigger an actionable alert.',
 story:'A new administrator role is granted to a user at 03:14. The API records a generic 200 response, but nobody is alerted and the log lacks the actor and target.',
 principle:'Capture meaningful security events with enough context to investigate them, then route important detections to someone who can respond.',
 analogy:'A fire alarm that writes the room number in a notebook but never rings is not much use during a fire.',
 stages:[['01 / EVENT','An account privilege change occurs.'],['02 / LOG','The application records a security event with actor, target and outcome.'],['03 / DETECT','A rule identifies an unusual privileged change.'],['04 / RESPOND','An alert reaches an operator, who validates the activity.']],
 observe:'Privilege changes without an audit event, failed logins without rate-based detection, missing correlation IDs and ignored alert channels.',
 controls:['Log identity, time, event type, target and outcome for security actions.','Preserve log integrity and apply reasonable retention and access controls.','Build and test alert rules for meaningful abuse scenarios.','Assign alert ownership, escalation and response runbooks.'],
 gotcha:'More logs are not automatically better. They must be useful, reviewed and protected; never log passwords or raw tokens.',
 specimen:['audit-event','login-burst','missing-alert'],
 questions:[
 ['What is missing if privileged actions are recorded but no one is notified?',['An actionable detection and alert response path','A larger log font','A new homepage theme','A server restart schedule'],0,'Useful logging should support detection and a response workflow.'],
 ['Which audit fields help investigate a role change?',['Actor, target, timestamp, action and outcome','Only the HTTP status code','Only browser screen dimensions','The user’s password'],0,'An investigator needs to know who did what to whom, when and with what result.'],
 ['Why should access to security logs be restricted?',['Logs may contain sensitive data and must resist tampering','Logs are always public information','Log access has no security impact','Monitoring works only when all users can edit logs'],0,'Audit trails need confidentiality and integrity, as well as availability.']]
},
{
 id:'a10',code:'A10:2025',title:'Mishandling of Exceptional Conditions',short:'What happens when the plan breaks?',sector:'RESILIENCE',accent:'#c7a58b',difficulty:'ADVANCED',time:12,
 lead:'Systems must make safe decisions when dependencies fail, time out, return malformed data, or hit unexpected states. Failure handling is part of authorization and integrity.',
 story:'A payment API times out while the order service waits for fraud screening. A developer catches every exception and allows the order to complete anyway.',
 principle:'Classify failures, set safe defaults, preserve state consistency and return useful errors without disclosing internals.',
 analogy:'If the badge reader loses power, a secure server room should not automatically unlock for everyone.',
 stages:[['01 / CHECK','The service requests a required security decision.'],['02 / FAULT','A downstream service times out.'],['03 / BRANCH','A broad catch block treats unknown as approved.'],['04 / SAFE PATH','The operation pauses or denies until the critical check can be completed.']],
 observe:'Catch-all blocks that silently allow actions, errors exposing stack traces, partial transactions and security checks skipped on timeout.',
 controls:['Define fail-closed behavior for security-critical checks.','Use timeouts, retries with limits and idempotent operations.','Return generic user-facing errors while keeping protected diagnostic logs.','Test dependency outages and malformed responses as first-class scenarios.'],
 gotcha:'Failing closed is not the answer to every business failure; classify which operations are security-critical and design appropriate degradation.',
 specimen:['timeout','stacktrace','retry'],
 questions:[
 ['A fraud-screening service times out. What should a security-critical checkout do?',['Pause or reject the sensitive operation until the check can be evaluated','Assume approval if no response arrives','Skip recording the attempted transaction','Return a full stack trace to the user'],0,'Security-critical decisions should not silently default to allowed on an unknown response.'],
 ['What makes a retry safer for a payment update?',['Idempotency and bounded retry behavior','An infinite retry loop','A new transaction on each attempt','No transaction ID in the logs'],0,'A bounded, idempotent operation avoids accidental duplicate effects during timeouts.'],
 ['What should a production error response avoid exposing?',['Internal stack traces, tokens and connection details','A general failure message','A correlation ID','A safe retry suggestion'],0,'Detailed diagnostics belong in protected logs; clients need useful but non-sensitive errors.']]
}
];

// These specimens are strings only. Never evaluated, interpreted as HTML, or sent to a server.
// For non-injection risks, "payload" means an observable request, configuration, or data specimen.
export const specimens = [
['id-change','Object reference change','ACCESS','GET /api/invoices/1025','The request changes an invoice ID. The vulnerable behavior would be returning a different customer’s record.','Compare the object owner to the authenticated user on the server.'],
['role-parameter','Untrusted role field','ACCESS','{"displayName":"Sam","role":"admin"}','If the server trusts a submitted role value, the user can grant themselves privileges.','Ignore caller-supplied privileges; derive roles from the server-side identity.'],
['local-url','Local-network URL','ACCESS','http://127.0.0.1:8080/admin','Illustrates an SSRF target: a backend fetcher must not assume that a user-supplied URL is safe. No request is sent.','Use destination allowlists and block loopback, metadata and private network addresses.'],
['cors','Overbroad CORS header','CONFIG','Access-Control-Allow-Origin: *','An overly broad browser origin policy may expose readable data depending on the endpoint and credentials.','Specify trusted origins and enforce authentication/authorization independently.'],
['debug','Verbose debug mode','CONFIG','DEBUG=true\nSHOW_STACK_TRACES=true','A deployment keeps diagnostics enabled and can expose internals.','Disable debug features and return safe errors in production.'],
['directory-index','Directory listing example','CONFIG','autoindex on;','A web-server setting may expose directory contents unintentionally.','Disable indexing for protected resources and review web server routing.'],
['dependency','Dependency name confusion','SUPPLY','package: ui-auth-helper-next@99.0.0','A surprising or lookalike package name is a review signal, not evidence of compromise.','Pin dependencies, verify maintainers and registries, review lockfile changes.'],
['workflow','CI permissions','SUPPLY','permissions: write-all','Broad workflow permissions increase impact if build steps run untrusted code.','Grant the minimum token permissions for each workflow job.'],
['artifact','Unverified binary','SUPPLY','artifact.zip + checksum.txt (same untrusted source)','A digest bundled with a tampered artifact can be changed too.','Check signed provenance or a reference from an independently trusted channel.'],
['base64','Base64 is not encryption','CRYPTO','c2VjcmV0','This is just the Base64 encoding of a word; it offers no confidentiality.','Use cryptography with properly managed keys when secrecy is needed.'],
['weak-hash','Generic password digest','CRYPTO','sha256(password)','A fast generic hash makes offline password guessing easier than a password-specific construction.','Use Argon2id or an appropriately configured scrypt/bcrypt scheme with unique salts.'],
['cleartext','Secret in a log','CRYPTO','INFO session_token=demo-token-123','Logging authentication secrets expands who can access or replay them.','Redact secrets and reduce log access and retention.'],
['sqli-quote','SQL quote boundary','INJECTION',"'",'A lone quote is a diagnostic input: a broken query may expose unsafe string construction. It does not itself prove exploitability.','Use parameterized queries and avoid user-controlled SQL fragments.'],
['sqli-boolean','SQL boolean condition','INJECTION',"' OR '1'='1' --",'In an unsafe string-concatenated query, the boolean expression can alter the intended WHERE condition. This remains text here.','Bind all values as parameters; validate authorization separately.'],
['xss-tag','HTML element injection','INJECTION','<img src=x onerror=alert(1)>','A browser can execute an event handler if untrusted input reaches an executable HTML sink. The app displays this string only.','Use textContent or context-appropriate output encoding; prefer CSP as defense in depth.'],
['xss-attribute','Attribute escape','INJECTION','" onmouseover="alert(1)','Breaking out of a quoted attribute illustrates a context-sensitive output-encoding problem.','Encode for HTML attribute contexts, or use safe DOM APIs.'],
['cmd-echo','Harmless shell metacharacter','INJECTION','; echo CASEFILE_TEST','A shell can interpret a semicolon as a command separator if input is interpolated into a shell command. Not executed.','Avoid shell concatenation; use safe argument arrays and command allowlists.'],
['ssti','Template expression probe','INJECTION','{{ 7 * 7 }}','In some template engines, arithmetic markers are evaluated rather than displayed. Not every template engine uses this syntax.','Keep user input out of template source; pass it as data.'],
['coupon','Repeated redemption request','DESIGN','POST /redeem {"code":"WELCOME","user":42}','Two identical coupon requests test whether redemption is single-use server-side.','Enforce a unique redemption constraint atomically.'],
['race','Concurrent update pattern','DESIGN','2 x POST /redeem (simultaneous)','A race can slip through a check-then-write flow without transactional protection.','Use a transaction or database constraint that is atomic.'],
['insecure-flow','Unrestricted action','DESIGN','POST /transfer {"amount":10000}','A workflow without business limits can be abused even without injection.','Design limits, approvals, abuse cases and reliable server-side checks.'],
['reset-token','Reset token reuse','AUTH','GET /reset?token=demo-reset-token','A reset URL needs expiry and single-use rules. This token is fictional.','Generate high-entropy tokens, expire and invalidate them after use.'],
['session-url','Session embedded in URL','AUTH','GET /dashboard?session=DEMO_SESSION','URLs can leak into logs and browser history; session credentials should not be there.','Use secure HttpOnly cookies and session rotation.'],
['login-rate','Repeated failures','AUTH','5 x POST /login → 401','A pattern of failures is useful for rate controls and detection, not proof of compromise.','Implement adaptive limits, MFA and monitored login events.'],
['hash-sidecar','Untrusted checksum','INTEGRITY','download.zip + download.sha256 (same host)','Matching these files only proves internal consistency if the host can replace both.','Verify with a trusted signature or separately authenticated digest.'],
['deserialize','Unsafe object restoration','INTEGRITY','deserialize(untrusted_bytes)','Some object formats can instantiate executable behaviors when loading attacker-controlled data.','Use strict data-only parsers, schemas and vetted formats.'],
['update','Unsigned policy update','INTEGRITY','GET /policy/latest.json','A policy download without provenance checks can silently change security behavior.','Verify the origin, content and approval of policy updates.'],
['audit-event','Missing audit context','LOGGING','2026-10-28T03:14Z POST /roles 200','A generic HTTP access line does not show who changed which account’s privilege.','Record actor, target, action, outcome and correlation IDs securely.'],
['login-burst','Detection signal','LOGGING','10 failed logins / 60 seconds / account=demo','This is a candidate detection condition, not automatically proof of password spraying.','Correlate accounts, sources and success events; tune alert rules.'],
['missing-alert','No owner for detection','LOGGING','SEV=HIGH event=privilege_changed alert=false','An important event may be logged but never brought to an analyst’s attention.','Route actionable alerts to an owned queue and test the escalation path.'],
['timeout','Fail-open condition','EXCEPTION','try: check_payment()\nexcept Timeout: return APPROVED','A broad exception handler can turn an unknown security decision into approval.','For critical checks, pause or reject, then retry safely.'],
['stacktrace','Verbose error leak','EXCEPTION','HTTP 500 + db_connection_string in trace','Exposing internal connection information helps an attacker understand the environment.','Provide a generic client error and retain details in restricted logs.'],
['retry','Non-idempotent retries','EXCEPTION','POST /charge retried 3x without idempotency key','A lost response can make the caller repeat a financial action.','Use idempotency keys and bounded retries with a consistent transaction state.']
].map(([id,name,kind,payload,meaning,mitigation])=>({id,name,kind,payload,meaning,mitigation}));

export const incidents = [
 {id:'ttp1', title:'The suspicious attachment',tactic:'Initial Access',technique:'Phishing',identifier:'T1566',procedure:'A fictional employee receives a message impersonating a familiar internal team and is directed to a lookalike portal.',event:'email.sender=alerts@helpdesk.example subject="Review your account"',answer:1,choices:['Disable all DNS queries','Verify sender context and report the impersonation','Delete all mailbox audit logs'],why:'The observed behavior is a delivery attempt, not evidence that a payload executed. Confirm sender, destination and user interaction before escalating.',defense:'Mail authentication, user reporting, safe link analysis and identity protections.'},
 {id:'ttp2', title:'Sign-in anomaly',tactic:'Credential Access',technique:'Brute Force',identifier:'T1110',procedure:'Repeated sign-in failures occur across multiple fictional users from one source, followed by a successful login.',event:'20 x login.failed across 8 users; login.success user=demo',answer:2,choices:['Treat one 401 as proof of a breach','Ignore it because all failed requests are harmless','Correlate successes and failure patterns; challenge or restrict suspicious activity'],why:'A pattern plus a success warrants validation. Password spraying is an interpretation to investigate, not an automatic conclusion.',defense:'MFA, adaptive throttling, alerts and log context.'},
 {id:'ttp3', title:'Unexpected scripting',tactic:'Execution',technique:'Command and Scripting Interpreter',identifier:'T1059',procedure:'A test workstation starts an unexpected command interpreter under a document viewer.',event:'parent=document-viewer child=shell.exe cmdline="echo TEST"',answer:0,choices:['Investigate process parentage and user context','Assume that every script is malicious','Remove every script interpreter from the OS'],why:'Unexpected parent-child chains are leads. Correlate process details, allowlists and user activity.',defense:'Application control, process telemetry and least privilege.'},
 {id:'ttp4', title:'The delayed restart',tactic:'Persistence',technique:'Scheduled Task/Job',identifier:'T1053',procedure:'A lab agent adds a task that runs at sign-in under the user context.',event:'task.created name=Updater-Demo trigger=onlogon',answer:1,choices:['Ignore tasks because they are normal OS features','Check the creator, command, trigger and authorization of the new task','Conclude data exfiltration occurred'],why:'A scheduled job may be legitimate or malicious. Its origin and target command matter.',defense:'Task creation auditing, baseline comparisons and protected admin access.'},
 {id:'ttp5', title:'The remote share',tactic:'Lateral Movement',technique:'Remote Services',identifier:'T1021',procedure:'A fictional administrator account accesses several hosts over a remote management protocol from an unusual jump host.',event:'auth.success source=jump-test target=host-1,host-2,host-3',answer:0,choices:['Review authorization, source, timing and affected hosts','Block all lateral communication permanently','Assume every successful login is a compromise'],why:'Multiple remote sessions are meaningful only in context of asset roles and approved workflows.',defense:'Privileged access management, network segmentation and authentication audit trails.'},
 {id:'ttp6', title:'The outbound transfer',tactic:'Exfiltration',technique:'Exfiltration Over Web Service',identifier:'T1567',procedure:'A demo workstation uploads an unusually large archive to a new external web service after reading sensitive files.',event:'https.upload bytes=400000000 dst=unknown.example',answer:2,choices:['Publish the destination to all employees','Delete the source logs immediately','Validate destination, archive contents and data handling policy'],why:'A large upload alone is not enough; combine host, user, file and network telemetry to assess intent.',defense:'Egress visibility, data classification, DLP and incident investigation.'}
];

export const sources=[
 {label:'OWASP Top 10:2025',url:'https://top10.owasp.org/2025/'},
 {label:'OWASP Web Security Testing Guide',url:'https://wstg.owasp.org/'},
 {label:'MITRE ATT&CK — tactics, techniques & procedures',url:'https://attack.mitre.org/resources/faq/'},
 {label:'OWASP Cheat Sheet Series',url:'https://cheatsheetseries.owasp.org/'},
];
