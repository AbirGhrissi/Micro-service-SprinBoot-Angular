package org.ms.client_service.web;

import org.ms.client_service.entities.Client;
import org.ms.client_service.repository.ClientRepository;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/clients")
@RefreshScope  // Permet le rechargement dynamique des configurations
public class ClientRestController {

    @Autowired
    private ClientRepository clientRepository;

    // Injecter les propriétés de configuration
    @Value("${custom.client.param:default_value}")
    private String clientParam;
    
    @Value("${email:default@email.com}")
    private String email;

	@GetMapping(path = "/clients")
	public List<Client> list() {
		return clientRepository.findAll();
	}

	@GetMapping(path = "/clients/{id}")
	public Client getOne(@PathVariable Long id) {
		return clientRepository.findById(id).get();
	}

	@PostMapping(path = "/clients")
	public Client save(@RequestBody Client client) {
		return clientRepository.save(client);
	}

	@PutMapping(path = "/clients/{id}")
	public Client update(@PathVariable Long id, @RequestBody Client client) {
		client.setId(id);
		return clientRepository.save(client);
	}

	@DeleteMapping(path = "/clients/{id}")
	public void delete(@PathVariable Long id) {
		clientRepository.deleteById(id);
	}
	@GetMapping("/config-test")
    public Map<String, Object> testConfig() {
        return Map.of(
            "configStatus", "OK",
            "clientParam", clientParam,
            "email", email,
            "activeInstances", Runtime.getRuntime().availableProcessors(),
            "servicePort", "8081" // À adapter si port dynamique
        );
    }
}