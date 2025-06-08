package org.ms.factureservice.web;

import java.util.Map;

import org.ms.factureservice.entities.Facture;
import org.ms.factureservice.feign.ClientServiceClient;
import org.ms.factureservice.feign.ProduitServiceClient;
import org.ms.factureservice.model.Client;
import org.ms.factureservice.model.Produit;
import org.ms.factureservice.repository.FactureLigneRepository;
import org.ms.factureservice.repository.FactureRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RefreshScope
public class FactureRestController {
	private FactureRepository factureRepository;
	private FactureLigneRepository factureLigneRepository;
	private ClientServiceClient clientServiceClient;
	private ProduitServiceClient produitServiceClient;

	public FactureRestController(FactureRepository factureRepository, FactureLigneRepository factureLigneRepository,
			ClientServiceClient clientServiceClient, ProduitServiceClient produitServiceClient) {
		this.factureRepository = factureRepository;
		this.factureLigneRepository = factureLigneRepository;
		this.clientServiceClient = clientServiceClient;
		this.produitServiceClient = produitServiceClient;
	}

	@GetMapping(path = "/full-facture/{id}")
	public Facture getFacture(@PathVariable(name = "id") Long id) {
		Facture facture = factureRepository.findById(id).get();
		Client client = clientServiceClient.findClientById(facture.getClientID());
		facture.setClient(client);
		facture.getFacturekignes().forEach(fl -> {
			Produit product = produitServiceClient.findProductById(fl.getProduitID());
			fl.setProduit(product);
		});
		return facture;
	}
	 @Value("${facture.default.currency}")
	    private String defaultCurrency;

	    @GetMapping("/config")
	    public Map<String, String> getConfig() {
	        return Map.of(
	            "currency", defaultCurrency,
	            "source", "config-server"
	        );
	    }
}