package br.edu.ifpe.recife.labgeo.sigabem.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
	private String cpf;
	private String dt;
	private String user_notification_id;
}
